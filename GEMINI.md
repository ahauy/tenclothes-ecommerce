# Chào mừng đến với không gian làm việc dự án E-Commerce TenClothes!

Tôi là AI Assistant của bạn. Dưới đây là các quy tắc nền tảng và nguyên tắc kỹ thuật mà tôi **bắt buộc** phải tuân thủ nghiêm ngặt trong mọi phiên làm việc trên dự án này.

## 1. Môi trường & Công nghệ cốt lõi

**Frontend (Cả App và Admin):**
- **Core:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS v4. Tuân thủ tuyệt đối các design token và phong cách UI "Quiet Luxury" (màu trung tính, không gian rộng, typography thanh mảnh). Không sử dụng các thiết kế mặc định của AI (ví dụ: gradient tím/hồng).
- **State Management:** Zustand.
- **Form & Validation:** React Hook Form + Zod.
- **Data Fetching:** Axios.

**Backend:**
- **Core:** Node.js, Express, TypeScript.
- **Database:** MongoDB với Mongoose (ODM).
- **Validation:** Zod.

## 2. Quy tắc Kiến trúc & Cấu trúc Code

**Backend (MVC + Service Pattern là bất biến):**
- **Services:** Chứa 100% Business Logic.
- **Controllers:** Chỉ xử lý Request/Response (lấy dữ liệu từ Service và trả về JSON). Tuyệt đối không viết logic xử lý dữ liệu ở đây.
- **Routes:** Chỉ dùng để định nghĩa endpoint và áp dụng middlewares.
- **Models:** Chứa Schema và các phương thức tương tác DB cơ bản.

**Frontend:**
- **Functional Components:** Sử dụng 100% Functional Components và Hooks.
- **Tái sử dụng:** Tách nhỏ UI thành các component (ví dụ: Button, Input) đặt trong `src/components`. Không viết component dài quá 300 dòng.
- **Custom Hooks:** Tách logic phức tạp hoặc logic fetch data ra khỏi UI component bằng Custom Hooks.

## 3. Quy tắc TypeScript & Chất lượng Code (Sống còn)

- **Strict Mode:** TypeScript Strict Mode là bắt buộc.
- **Kiểu dữ liệu:** TUYỆT ĐỐI KHÔNG SỬ DỤNG `any`. Sử dụng Interface/Type. Nếu không chắc chắn, dùng `unknown` và kiểm tra kiểu (Type Guard). Không dùng các thủ thuật vượt rào kiểu dữ liệu (casts, suppress warnings).
- **Clean Code:**
  - Hàm phải ngắn gọn (dưới 50 dòng).
  - Tên biến/hàm phải mô tả rõ ràng nghiệp vụ (`isCouponEligible`, không dùng `check`).
- **Thay đổi Surgical:** Khi sửa file, chỉ tập trung vào phần cần sửa. Giữ nguyên cấu trúc, phong cách code và format của phần còn lại.

## 4. Bảo mật & Hiệu suất

- **Validation:** 100% dữ liệu đầu vào (cả Backend và Frontend) phải được validate chặt chẽ (ưu tiên dùng Zod).
- **Bảo mật Backend:** Sanitize đầu vào để chống NoSQL Injection. Không log thông tin nhạy cảm.
- **Hiệu suất DB:** LUÔN sử dụng `.lean()` cho các query Mongoose chỉ dùng để đọc dữ liệu. LUÔN phân trang (Pagination) cho các danh sách.
- **Bảo mật Frontend:** Không hardcode API Keys hay secret keys; sử dụng biến môi trường.

## 5. Quy trình làm việc & Project Memory

- **Khám phá trước, Code sau:** Luôn kiểm tra các file liên quan (routes, services, components) để hiểu ngữ cảnh hiện tại trước khi đề xuất hoặc viết code.
- **Test:** Khi thêm tính năng mới hoặc sửa lỗi, phải quan tâm đến việc kiểm thử (nếu dự án có thiết lập test).
- **Atomic Commits:** Mỗi thay đổi (hoặc cụm thay đổi) chỉ phục vụ một mục đích duy nhất.
- **Cập nhật MEMORY.md:** Nếu có thay đổi lớn về kiến trúc, luồng nghiệp vụ hoặc học được bài học quan trọng (learnings), hãy cập nhật vào `MEMORY.md` hoặc các file trong `.agents/rules/` để lưu giữ dài hạn.

---
*Lưu ý: Tài liệu này được thiết lập để đảm bảo chất lượng kỹ thuật cao nhất cho dự án TenClothes. Mọi dòng code tôi tạo ra đều sẽ được đối chiếu với các quy tắc này.*