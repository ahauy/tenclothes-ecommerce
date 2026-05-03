---
name: backend-expert
description: Chuyên gia phát triển Backend Node.js/Express theo chuẩn của dự án TenClothes.
---

# Tên Skill: Backend Expert (TenClothes)

## 1. Mục đích
Skill này định hướng và cung cấp các tiêu chuẩn, quy trình bắt buộc khi thực hiện phát triển mã nguồn Backend cho dự án TenClothes. Mọi dòng code sinh ra hoặc chỉnh sửa đều phải tuân thủ nghiêm ngặt các quy định này.

## 2. Kiến trúc & Cấu trúc (MVC + Service Pattern)
- **Services:** Chứa 100% Business Logic. Không viết logic ở bất cứ đâu khác (Controller, Route...).
- **Controllers:** Chỉ xử lý Request (nhận params, body, query sau khi đã qua Zod validation) và Response (gọi hàm từ Service và trả về kết quả JSON). Tuyệt đối không chứa logic nghiệp vụ.
- **Routes:** Chỉ định nghĩa endpoint và gắn các middlewares (auth, validation bằng Zod).
- **Models:** Định nghĩa Schema Mongoose, các index, và phương thức tương tác database cơ bản. Không nhồi nhét logic phức tạp vào Model.

## 3. Quy chuẩn TypeScript & Clean Code
- **Strict Mode:** Bắt buộc áp dụng TypeScript strict mode.
- **Type/Interface:** Tuyệt đối không dùng `any`. Định nghĩa Interface/Type rõ ràng. Khi chưa xác định được kiểu, hãy dùng `unknown` và kiểm tra kiểu (Type Guard).
- **Ngắn gọn & Dễ hiểu:** Hàm dài không quá 50 dòng. Tên biến/hàm thể hiện rõ nghiệp vụ (VD: `isCouponValid`, `calculateTotalAmount` thay vì `check`, `calc`).
- **Surgical Change:** Khi sửa code, chỉ tập trung vào phần cần sửa, giữ nguyên phong cách code và cấu trúc có sẵn của file/hệ thống.

## 4. Bảo mật & Hiệu suất
- **Validation:** 100% dữ liệu đầu vào sử dụng Zod để validate.
- **Mongoose Performance:** Luôn dùng `.lean()` cho các query chỉ để đọc dữ liệu (ví dụ API GET danh sách). Không lấy toàn bộ document mongoose nếu chỉ cần JSON.
- **Phân trang (Pagination):** Bắt buộc áp dụng cho các API trả về danh sách dữ liệu.
- **Bảo mật:** Sanitize và kiểm soát đầu vào để chống NoSQL Injection. Không trả về thông tin nhạy cảm của hệ thống/user.

## 5. Quy trình thực hiện công việc (Workflow)
1. **Khám phá (Discovery):** Sử dụng các công cụ đọc file (`view_file`, `list_dir`) để tìm hiểu model, route, service hiện tại trước khi đề xuất code.
2. **Lên kế hoạch (Planning):** Xác định luồng thay đổi (từ validation -> route -> controller -> service).
3. **Thực thi (Execution):** Áp dụng pattern hiện có, viết code rõ ràng theo từng phần. Luôn bắt đầu code logic lõi ở Service trước.
4. **Kiểm tra (Review):** Đảm bảo không phá vỡ logic cũ, đã handle error (`try/catch`, throw `Error`), và tuân thủ chuẩn TypeScript.
