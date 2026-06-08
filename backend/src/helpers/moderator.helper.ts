import axios from "axios";

interface ModerationResult {
  isSafe: boolean;
  action: "approved" | "flagged" | "rejected";
  reason: string;
}

// Lớp 1: Danh sách từ khóa cấm cục bộ (Local Blacklist)
const LOCAL_BLACKLIST = [
  "địt",
  "đéo",
  "cặc",
  "lồn",
  "vcl",
  "vkl",
  "chó đẻ",
  "đụ",
  "phản động",
  "chống phá",
  "lật đổ",
  "bán nước",
  "hoàng sa là của trung quốc",
  "trường sa là của trung quốc",
  "luat an ninh mang",
  "biểu tình",
  "dân chủ cuội",
  "đảng cộng sản việt nam bôi nhọ",
];

export const checkLocalBlacklist = (
  content: string,
): { isViolated: boolean; matchedWord?: string } => {
  const normalized = content.toLowerCase();
  for (const word of LOCAL_BLACKLIST) {
    if (normalized.includes(word)) {
      return { isViolated: true, matchedWord: word };
    }
  }
  return { isViolated: false };
};

// Hàm tải ảnh từ URL và convert sang base64 phục vụ gửi kèm cho Gemini AI
const fetchImageAsBase64 = async (
  url: string,
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"] || "image/jpeg";
    return {
      data: buffer.toString("base64"),
      mimeType,
    };
  } catch (error) {
    console.error("Lỗi khi tải ảnh để gửi cho AI:", error);
    return null;
  }
};

/**
 * Kiểm duyệt nội dung đánh giá qua 2 lớp tự động:
 * Lớp 1: Khớp từ khóa tục tĩu và nhạy cảm chính trị cục bộ.
 * Lớp 2: Gọi Gemini AI (REST API) phân tích ngữ cảnh văn bản và hình ảnh đa phương thức (Multimodal).
 */
export const moderateContent = async (
  content: string,
  images: string[] = [],
): Promise<ModerationResult> => {
  // LỚP 1: Kiểm tra cục bộ (Local Blacklist)
  const localCheck = checkLocalBlacklist(content);
  if (localCheck.isViolated) {
    return {
      isSafe: false,
      action: "rejected",
      reason: `Vi phạm từ điển từ cấm (Phát hiện từ: "${localCheck.matchedWord}")`,
    };
  }

  const apiKey = process.env["GEMINI_API_KEY"];
  // Nếu không cấu hình GEMINI_API_KEY, ta bỏ qua lớp AI và cho phép duyệt tự động nếu không ảnh
  if (!apiKey) {
    console.warn(
      "CẢNH BÁO: Chưa cấu hình GEMINI_API_KEY trong file .env. Bỏ qua kiểm duyệt AI.",
    );
    return {
      isSafe: true,
      action: "approved",
      reason: "Bỏ qua kiểm duyệt AI (Chưa cấu hình API Key)",
    };
  }

  // LỚP 2: Sử dụng Gemini AI
  try {
    const parts: any[] = [];

    // Thêm prompt hệ thống và văn bản cần đánh giá
    const prompt = `Bạn là một hệ thống kiểm duyệt nội dung tự động thông minh cho trang thương mại điện tử tại Việt Nam.
Nhiệm vụ của bạn là phân tích đánh giá của khách hàng gồm văn bản và hình ảnh đính kèm (nếu có) để phát hiện các nội dung vi phạm pháp luật hoặc quy chuẩn cộng đồng:
1. Chống phá Nhà nước Việt Nam, bôi nhọ lãnh đạo, xuyên tạc lịch sử, vi phạm chủ quyền quốc gia (ví dụ: bản đồ hình lưỡi bò, ký hiệu phản động).
2. Từ ngữ thô tục, chửi bới, công kích, phân biệt chủng tộc/giới tính.
3. Spam quảng cáo dịch vụ khác, cá độ, lừa đảo.
4. Hình ảnh khiêu dâm, đồi trụy, bạo lực máu me.

Văn bản cần kiểm tra: "${content}"

Hãy trả về một đối tượng JSON duy nhất theo cấu trúc sau (không trả thêm bất cứ ký tự nào khác ngoài định dạng JSON này):
{
  "isSafe": boolean, // true nếu nội dung an toàn và lành mạnh, false nếu vi phạm bất kỳ điều nào trên
  "action": "approve" | "flagged" | "reject", // approve nếu hoàn toàn sạch, flagged nếu nghi ngờ cần Admin xem xét, reject nếu vi phạm rõ ràng
  "reason": "Mô tả lý do bằng tiếng Việt nếu bị flagged hoặc reject, ngược lại ghi là 'Nội dung an toàn'"
}`;

    parts.push({ text: prompt });

    // Tải hình ảnh đính kèm nếu có (tối đa 3 ảnh để tránh quá tải API và tăng tốc độ xử lý)
    const imagesToProcess = images.slice(0, 3);
    for (const imageUrl of imagesToProcess) {
      const imgData = await fetchImageAsBase64(imageUrl);
      if (imgData) {
        parts.push({
          inlineData: {
            mimeType: imgData.mimeType,
            data: imgData.data,
          },
        });
      }
    }

    let attempts = 0;
    const maxAttempts = 3;
    let response;

    while (attempts < maxAttempts) {
      try {
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [
              {
                parts: parts,
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 15000, // Timeout 15 giây
          },
        );
        break; // Success, break loop
      } catch (error: any) {
        attempts++;
        const status = error.response?.status;
        if ((status === 503 || status === 504 || status === 429) && attempts < maxAttempts) {
          console.warn(`Gemini API gặp lỗi tạm thời ${status}. Đang thử lại lần ${attempts}/${maxAttempts}...`);
          await new Promise((resolve) => setTimeout(resolve, attempts * 1500)); // Chờ 1.5s, 3s
          continue;
        }
        throw error; // If other error or max attempts reached
      }
    }

    const resultText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error("Không nhận được phản hồi từ Gemini API");
    }

    const parsedResult = JSON.parse(resultText.trim());
    
    // Ánh xạ lại action để tương thích với Database Mongoose Schema ("approved" | "flagged" | "rejected")
    let action: "approved" | "flagged" | "rejected" = "approved";
    if (parsedResult.action === "reject" || parsedResult.action === "rejected" || parsedResult.action === "approve") {
      // Nếu là reject/rejected thì gán rejected, nếu là approve/approved thì gán approved
      action = (parsedResult.action === "reject" || parsedResult.action === "rejected") ? "rejected" : "approved";
    } else if (parsedResult.action === "flagged") {
      action = "flagged";
    }

    return {
      isSafe: parsedResult.isSafe ?? true,
      action: action,
      reason: parsedResult.reason ?? "Nội dung an toàn",
    };
  } catch (error: any) {
    console.error(
      "Lỗi khi gọi Gemini API để kiểm duyệt nội dung:",
      error.message || error,
    );
    // Nếu lỗi API, đánh dấu flagged để Admin duyệt thủ công
    return {
      isSafe: false,
      action: "flagged",
      reason: `Không thể kiểm duyệt bằng AI do lỗi kết nối (Chi tiết: ${error.message || "Lỗi hệ thống"})`,
    };
  }
};
