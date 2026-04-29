# TenClothes Feature Development Workflow

Quy trình này hướng dẫn AI Agent biến một ý tưởng sơ khai của người dùng thành một tính năng hoàn chỉnh, chuẩn mực.

## Bước 1: Khám Phá & Làm Rõ (Discovery)
- **Hành động:** Đặt ít nhất 2-3 câu hỏi để làm rõ yêu cầu.
- **Mục tiêu:** 
    - Xác định User Story (Người dùng nhận được giá trị gì?).
    - Xác định các trường hợp biên (Edge cases).
- **Đầu ra:** Bản tóm tắt yêu cầu (Requirements Summary).

## Bước 2: Thiết Kế Giải Pháp (Technical & UI Design)
- **Backend:** Phác thảo Schema Database, danh sách API mới/cần sửa.
- **Frontend:** Phác thảo cấu trúc Component và các trạng thái (Loading, Success, Error).
- **UI/UX:** Mô tả cách áp dụng triết lý "Quiet Luxury" vào tính năng này.
- **Duyệt:** Chờ người dùng phản hồi "Đồng ý" với giải pháp.

## Bước 3: Triển Khai Backend (Backend First)
- **Hành động:** 
    - Cập nhật Interfaces.
    - Tạo/Sửa Model.
    - Viết Service -> Controller -> Route.
- **Xác minh:** Kiểm tra lỗi cú pháp và logic nghiệp vụ cơ bản.

## Bước 4: Triển Khai Frontend (Frontend Execution)
- **Hành động:** 
    - Tạo Custom Hook nếu có logic phức tạp.
    - Xây dựng UI Component bằng Tailwind v4.
    - Kết nối API và quản lý State (Zustand).
- **Thẩm mỹ:** Đảm bảo Spacing, Typography và Motion đúng chuẩn Luxury.

## Bước 5: Kiểm Thử & Chốt (Verification & Finalization)
- **Kiểm tra:** 
    - Responsive (Mobile/Tablet/Desktop).
    - Các lỗi ReferenceError hoặc Import.
- **Bàn giao:** Hướng dẫn người dùng cách kiểm tra tính năng.
- **Kết thúc:** Cập nhật `MEMORY.md` và chờ xác nhận "Approved".
