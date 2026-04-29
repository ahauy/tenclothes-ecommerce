# TenClothes Coding & Development Standards

Tài liệu này quy định các quy tắc bắt buộc mà AI Agent phải tuân thủ khi làm việc trên dự án TenClothes.

## 1. Quy Tắc Kiến Trúc (Architecture Rules)
- **MVC + Service Pattern là bất biến:** 
    - Business Logic -> `Services`.
    - Request/Response Handling -> `Controllers`.
    - Routing & Middlewares -> `Routes`.
    - Database Schemas -> `Models`.
- **Tuyệt đối không:** Viết logic xử lý dữ liệu trong Controller hoặc Route.

## 2. Quy Tắc TypeScript & Code Quality
- **Strict Typing:** Luôn sử dụng Interface hoặc Type. Tuyệt đối không sử dụng `any`. Nếu không biết rõ kiểu dữ liệu, hãy sử dụng `unknown` và thực hiện Type Guard.
- **Surgical Updates:** Khi chỉnh sửa file lớn, chỉ thay đổi những phần cần thiết, giữ nguyên style và cấu trúc của các phần còn lại.
- **Clean Code:** 
    - Hàm không quá 50 dòng.
    - Tên biến phải mang tính mô tả cao (`isCouponEligible` thay vì `check`).

## 3. Quy Tắc Giao Diện (UI/UX - Quiet Luxury)
- **Aesthetic Fidelity:** Tuân thủ bảng màu trung tính, typography thanh mảnh và khoảng trắng rộng rãi.
- **No AI Slop:** Tránh các gradient tím/hồng mặc định của AI, tránh các component mẫu quá phổ biến.
- **Responsive:** Mọi component mới phải hoạt động hoàn hảo trên Mobile và Desktop.

## 4. Quy Tắc Bảo Mật & Dữ Liệu
- **Validation:** 100% input từ người dùng phải được validate bằng `Zod` trước khi đi vào lớp Service.
- **Data Protection:** Không bao giờ log thông tin nhạy cảm (Tokens, Passwords) ra console hoặc file log.
- **Database Safety:** Luôn sanitize đầu vào để chống NoSQL Injection. Sử dụng `.lean()` cho các query chỉ đọc.

## 5. Quy Tắc Git & Quy Trình
- **Atomic Commits:** Mỗi lần sửa đổi nên tập trung vào một mục đích duy nhất.
- **Commit Messages:** Đề xuất commit message rõ ràng theo format: `type(scope): description`.
- **Verification:** Sau khi code, phải kiểm tra lại các file liên quan xem có bị lỗi import hoặc ReferenceError không.

## 6. Project Memory
- **Update MEMORY.md:** Luôn cập nhật những thay đổi quan trọng về kiến trúc hoặc các "learnings" mới vào file bộ nhớ của dự án để duy trì sự nhất quán lâu dài.
