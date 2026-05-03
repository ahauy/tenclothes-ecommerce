# QUY TRÌNH & YÊU CẦU NGHIỆP VỤ CODE BACKEND (TENCLOTHES)

File này định nghĩa quy trình chuẩn và các yêu cầu nghiệp vụ bắt buộc khi thực hiện các yêu cầu (prompt) liên quan đến code backend của dự án TenClothes. Mọi xử lý từ AI hoặc lập trình viên đều phải tuân theo file này.

## 1. QUY TRÌNH THỰC HIỆN YÊU CẦU

Khi nhận được một yêu cầu liên quan đến Backend, thực hiện theo các bước sau:

**Bước 1: Phân tích & Khám phá (Discovery)**
- Hiểu rõ yêu cầu nghiệp vụ.
- Sử dụng công cụ (như `list_dir`, `view_file`, `grep_search`) để tìm và đọc các file liên quan hiện có (Model, Route, Controller, Service).
- Không tự ý tạo file mới hoặc đoán cấu trúc nếu chưa khám phá.

**Bước 2: Lập kế hoạch (Planning)**
- Xác định rõ luồng đi của dữ liệu: `Route -> Middleware (Auth/Zod) -> Controller -> Service -> Model`.
- Nếu thêm mới tính năng, phải xác định xem cần tạo những file nào và vị trí đặt file ở đâu.
- Luôn giữ tư duy: Chỉ có Service được phép chứa logic nghiệp vụ.

**Bước 3: Thực thi (Execution)**
- Code theo đúng kiến trúc và style của dự án.
- Tái sử dụng các helper, error handler, hoặc utility (nếu có).
- Code phải gọn gàng, rõ ràng, chia nhỏ hàm nếu cần thiết.

**Bước 4: Kiểm tra & Tối ưu (Review)**
- Kiểm tra lại các lỗi TypeScript (`any`, strict mode).
- Chắc chắn đã thêm xử lý lỗi (`try/catch`, throw `CustomError` hoặc HTTP Error phù hợp).
- Đảm bảo query database đã được tối ưu (ví dụ dùng `.lean()` khi chỉ đọc).

---

## 2. YÊU CẦU NGHIỆP VỤ CODE (CODING STANDARDS)

### 2.1. Kiến trúc thư mục (MVC + Service)
- **Model (`*.model.ts`):** Chỉ chứa Mongoose Schema, khai báo interface/type của document, và các hàm tương tác DB rất cơ bản.
- **Route (`*.route.ts`):** Chỉ làm nhiệm vụ định tuyến (HTTP method, endpoint URL) và gắn Middleware (ví dụ: `verifyToken`, `validateRequest(schema)`).
- **Controller (`*.controller.ts`):** Chỉ nhận Request, parse params/query/body, gọi hàm của Service, và trả về Response JSON. Tuyệt đối không viết logic DB hoặc tính toán ở đây.
- **Service (`*.service.ts`):** Là nơi duy nhất chứa business logic (tính toán, điều kiện kiểm tra, gọi nhiều model phối hợp). Các hàm trong Service nên return dữ liệu thuần.

### 2.2. Quy tắc TypeScript (Sống còn)
- **Không dùng `any`:** 100% code phải có type cụ thể. Sử dụng Interface hoặc Type. Nếu chưa biết kiểu, hãy dùng `unknown` và type guard.
- **Strict Mode:** Tuân thủ chặt chẽ cảnh báo của compiler. Không lạm dụng as (Type Assertion) để ép kiểu sai sự thật.
- **Tên biến/hàm:** Viết bằng tiếng Anh, theo chuẩn camelCase. Tên hàm phải bắt đầu bằng động từ và nói rõ mục đích (VD: `calculateOrderTotal`, không dùng `calc`).

### 2.3. Data Validation & Security
- 100% API payload (Body, Query, Params) phải được validate thông qua Zod trước khi vào Controller.
- Không tin tưởng bất kỳ dữ liệu nào từ client.
- Khi truy vấn DB, luôn cẩn thận với NoSQL Injection.

### 2.4. Performance (Hiệu suất)
- **Read-Only Queries:** Luôn sử dụng `.lean()` đối với Mongoose query nếu dữ liệu chỉ dùng để đọc/hiển thị và không cần lưu lại (save).
- **Pagination:** Các API dạng danh sách (`GET /items`) bắt buộc phải có tính năng phân trang (limit, page/skip).
- **Select fields:** Chỉ lấy các trường (fields) cần thiết từ database, tránh việc `select *` nếu document có dữ liệu lớn không cần dùng.

### 2.5. Xử lý lỗi (Error Handling)
- Trong Service, khi gặp điều kiện sai (không tìm thấy data, sai logic), hãy `throw` một lỗi rõ ràng.
- Đảm bảo hệ thống có middleware xử lý lỗi tập trung để bắt các lỗi ném ra từ Service/Controller và format thành response thống nhất.

> *Lưu ý: Bất cứ đoạn code nào sinh ra cũng sẽ được đối chiếu với bộ quy tắc này để đảm bảo chất lượng hệ thống.*
