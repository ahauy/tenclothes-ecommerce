# Quy Trình Thực Thi Agile/Scrum Dành Cho AI

Tài liệu này quy định quy trình làm việc chuẩn bắt buộc AI phải tuân thủ khi nhận một task mới. Hãy thực hiện tuần tự các bước dưới đây một cách nghiêm ngặt:

## Bước 1: Làm Rõ Yêu Cầu (User Story & Estimation)
*   **KHÔNG ĐƯỢC** viết code ngay lập tức khi nhận được yêu cầu ban đầu.
*   **HÃY** yêu cầu người dùng cung cấp rõ User Story (dưới dạng: *Là một [vai trò], tôi muốn [hành động] để [mục đích]*).
*   **HÃY** đặt câu hỏi nếu yêu cầu còn mơ hồ, thiếu chi tiết về luồng nghiệp vụ hoặc thiết kế (UI/UX).
*   **HÃY** đưa ra đánh giá dự kiến về độ phức tạp của task (Story Points hoặc thời gian dự kiến) và các rủi ro có thể xảy ra.

## Bước 2: Phân Tích & Lập Kế Hoạch (Analysis & Planning)
*   **HÃY** chủ động phân tích cấu trúc mã nguồn hiện tại bằng các công cụ tìm kiếm, đọc file để hiểu rõ ngữ cảnh của dự án.
*   **HÃY** lập ra một bản Kế hoạch triển khai (Implementation Plan) chi tiết. Bản kế hoạch phải bao gồm:
    *   Danh sách các file cần tạo mới.
    *   Danh sách các file cần chỉnh sửa.
    *   Cấu trúc dữ liệu hoặc API interface dự kiến.
*   **HÃY** chờ người dùng phản hồi và xác nhận đồng ý với bản kế hoạch này trước khi chuyển sang bước tiếp theo.

## Bước 3: Triển Khai Code & Quản Lý Git (Execution & Git Management)
*   **HÃY** đề xuất mã nguồn (code) bám sát bản kế hoạch đã được phê duyệt. Tuân thủ nghiêm ngặt các quy chuẩn kỹ thuật trong `tech-stack.md`.
*   **HÃY** chủ động kiểm tra trạng thái Git nếu có yêu cầu. Nếu xảy ra hiện tượng Merge Conflict trong quá trình làm việc, **HÃY** dừng lại, thông báo cho người dùng và đề xuất phương án giải quyết conflict một cách an toàn.
*   **HÃY** hướng dẫn người dùng chạy các bài test (nếu có) để đảm bảo code không phá vỡ hệ thống hiện tại.

## Bước 4: Kiểm Tra & Chốt Nghiệp Vụ (Review & Finalization)
*   **KHÔNG ĐƯỢC** tự ý coi như task đã hoàn thành và chuyển sang task khác.
*   **HÃY** tạm dừng và chờ người dùng kiểm tra (review) lại toàn bộ hệ thống trên môi trường local (hoặc staging).
*   **HÃY** sẵn sàng nhận feedback, sửa lỗi và cập nhật lại mã nguồn nếu người dùng yêu cầu.
*   **CHỈ KHI NÀO** người dùng chính thức xác nhận "Hoàn tất/Approved", mới tiến hành kết thúc luồng công việc của task hiện tại.
