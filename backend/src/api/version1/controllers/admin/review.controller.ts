import { Request, Response } from "express";
import Review from "../../../../models/review.model";
import { sendMail } from "../../../../helpers/sendMail";
import ApiError from "../../../../helpers/ApiError";
import { deleteReviewAdminService } from "../../services/admin/review.service";

/**
 * Lấy danh sách đánh giá phục vụ trang quản trị (Admin Dashboard)
 * Hỗ trợ phân trang, tìm kiếm và lọc trạng thái (status, aiStatus)
 */
export const getReviewsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Lọc theo trạng thái duyệt (pending, approved, rejected)
    if (req.query["status"]) {
      filter.status = req.query["status"];
    }

    // Lọc theo cảnh báo của AI (approved, flagged, rejected)
    if (req.query["aiStatus"]) {
      filter.aiStatus = req.query["aiStatus"];
    }

    // TỐI ƯU HIỆU SUẤT: Sử dụng .lean() cho truy vấn chỉ đọc và select các trường cần thiết
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName avatar email strikeCount")
      .populate("productId", "title thumbnail")
      .lean();

    const totalReviews = await Review.countDocuments(filter);

    res.status(200).json({
      status: true,
      message: "Lấy danh sách đánh giá thành công!",
      data: {
        reviews,
        pagination: {
          totalItems: totalReviews,
          totalPages: Math.ceil(totalReviews / limit),
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error: any) {
    console.error("Lỗi getReviewsAdmin: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Phê duyệt đánh giá của người dùng
 */
export const approveReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá!");
    }

    if (review.status === "approved") {
      res.status(200).json({
        status: true,
        message: "Đánh giá này đã được duyệt trước đó!",
        data: review,
      });
      return;
    }

    review.status = "approved";
    // Gọi .save() để kích hoạt middleware tự động tính toán lại rating của sản phẩm
    await review.save();

    res.status(200).json({
      status: true,
      message: "Phê duyệt đánh giá thành công!",
      data: review,
    });
  } catch (error: any) {
    console.error("Lỗi approveReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Từ chối phê duyệt đánh giá (ẩn đánh giá vi phạm hoặc nhạy cảm)
 */
export const rejectReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá!");
    }

    review.status = "rejected";
    // Gọi .save() để chạy lại rating trung bình (loại bỏ review bị reject khỏi điểm trung bình)
    await review.save();

    res.status(200).json({
      status: true,
      message: "Từ chối đánh giá thành công!",
      data: review,
    });
  } catch (error: any) {
    console.error("Lỗi rejectReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Xóa đánh giá hoàn toàn khỏi hệ thống (Admin)
 */
export const deleteReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params["id"];
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Mã đánh giá không hợp lệ!");
    }

    await deleteReviewAdminService(id);

    res.status(200).json({
      status: true,
      message: "Xóa đánh giá thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi deleteReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Cảnh cáo và đánh gậy người dùng
 */
export const strikeUserAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate("userId");
    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá!");
    }

    if (review.isStruck) {
      throw new ApiError(400, "Đánh giá này đã bị đánh gậy cảnh cáo trước đó!");
    }

    const user = review.userId as any; // Ép kiểu vì userId được populate
    if (!user) {
      throw new ApiError(404, "Không tìm thấy tài khoản người dùng tương ứng!");
    }

    // 1. Tăng số gậy
    user.strikeCount = (user.strikeCount || 0) + 1;

    // 2. Cập nhật trạng thái đánh giá về rejected và đánh dấu đã bị gậy
    review.status = "rejected";
    review.isStruck = true;

    // 3. Nếu số gậy >= 3, vô hiệu hóa tài khoản
    let accountStatusMessage = "";
    if (user.strikeCount >= 3) {
      user.isActive = false;
      accountStatusMessage = "<p style='color: red; font-weight: bold;'>Tài khoản của bạn đã bị KHÓA do vi phạm tiêu chuẩn cộng đồng quá 3 lần.</p>";
    } else {
      accountStatusMessage = `<p>Tài khoản của bạn hiện tại có <strong>${user.strikeCount}/3</strong> gậy cảnh cáo. Nếu đạt 3 gậy, tài khoản sẽ bị khóa tự động.</p>`;
    }

    // 4. Gửi email thông báo cho người dùng
    const emailSubject = `[TenClothes] Cảnh báo vi phạm tiêu chuẩn cộng đồng - Đánh gậy tài khoản`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Cảnh Cáo Vi Phản Tiêu Chuẩn Cộng Đồng</h2>
        <p>Xin chào <strong>${user.fullName}</strong>,</p>
        <p>Hệ thống TenClothes phát hiện bình luận đánh giá của bạn có nội dung khiếm nhã, thô tục hoặc không phù hợp với tiêu chuẩn cộng đồng:</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; font-style: italic;">
          "${review.content}"
        </div>
        
        <p>Đánh giá này đã bị ẩn khỏi hệ thống và tài khoản của bạn đã bị <strong>đánh thêm 1 gậy cảnh cáo</strong>.</p>
        
        <div style="background-color: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin-top: 0;"><strong>Trạng thái tài khoản của bạn:</strong></p>
          ${accountStatusMessage}
        </div>
        
        <p>Vui lòng tuân thủ các quy tắc ứng xử văn minh khi tham gia đánh giá sản phẩm tại TenClothes.</p>
        <p style="margin-top: 30px; border-top: 1px solid #f0f0f0; padding-top: 15px; color: #888; font-size: 12px;">Đây là email tự động từ hệ thống quản trị TenClothes Store. Vui lòng không phản hồi lại email này.</p>
      </div>
    `;

    // Gửi email
    await sendMail(user.email, emailSubject, emailHtml);

    // Lưu các thay đổi
    await user.save();
    await review.save();

    res.status(200).json({
      status: true,
      message: user.strikeCount >= 3 
        ? "Đánh gậy thành công! Tài khoản người dùng đã bị khóa do đạt giới hạn 3 gậy."
        : `Đánh gậy thành công! Tài khoản hiện có ${user.strikeCount}/3 gậy.`,
      data: {
        review,
        userStrikeCount: user.strikeCount,
        userIsActive: user.isActive
      }
    });
  } catch (error: any) {
    console.error("Lỗi strikeUserAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống khi đánh gậy!" });
  }
};
