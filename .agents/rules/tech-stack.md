# Tech Stack & Development Rules

Tài liệu này định nghĩa các tiêu chuẩn kỹ thuật, cấu trúc dự án và các thực hành tốt nhất dành cho hệ thống E-commerce TENCLOTHES. Tất cả các thành viên (bao gồm cả AI agents) bắt buộc phải tuân thủ các quy tắc này trong quá trình phát triển.

## 1. Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React 18+ (khởi tạo qua Vite).
- **Ngôn ngữ:** TypeScript.
- **Styling:** Tailwind CSS v4, sử dụng design token theo chuẩn Stitch UI.
- **State Management:** React Context API (cho local/global state đơn giản) hoặc Zustand/Redux Toolkit (nếu ứng dụng mở rộng phức tạp).
- **Data Fetching:** Axios hoặc Fetch API (Khuyến khích dùng React Query/TanStack Query cho caching và async state management).

### Backend
- **Runtime:** Node.js.
- **Framework:** Express.js.
- **Ngôn ngữ:** TypeScript.
- **Cơ sở dữ liệu:** MongoDB.
- **ODM (Object Data Modeling):** Mongoose.
- **Authentication:** JWT (JSON Web Tokens).

---

## 2. Tiêu Chuẩn Viết Code (Coding Standards)

### 2.1. TypeScript & Cú Pháp
- **Bắt buộc dùng Strict Mode:** Luôn bật `"strict": true` trong `tsconfig.json`. Tuyệt đối không sử dụng kiểu `any` trừ khi không còn cách nào khác (sử dụng `unknown` thay thế nếu cần).
- **Naming Conventions:**
  - `camelCase` cho biến, hàm, methods (`getUser`, `orderTotal`).
  - `PascalCase` cho class, interfaces, type aliases, và React Components (`UserProfile`, `OrderModel`).
  - `UPPER_SNAKE_CASE` cho hằng số (constants).
- **Linting & Formatting:** Sử dụng ESLint và Prettier. Code trước khi commit phải pass mọi rule linting.

### 2.2. Frontend (React)
- **Functional Components:** 100% sử dụng Functional Components và Hooks. Không sử dụng Class Components.
- **Chia Nhỏ Component:** Tránh các component quá lớn (hơn 300 dòng). Tách các phần UI thành các component nhỏ, tái sử dụng được (ví dụ: `Button`, `Input`, `ProductCard`) và đặt trong thư mục `src/components`.
- **Custom Hooks:** Tách biệt logic fetching data và logic phức tạp ra khỏi UI component bằng cách tạo Custom Hooks (ví dụ: `useAuth`, `useCart`).

### 2.3. Backend (Node.js & Express)
- **Tách biệt Logic:** Tuyệt đối không viết business logic bên trong Route.
- **Xử lý Bất đồng bộ:** Sử dụng `async/await`. Không sử dụng `.then().catch()` lồng nhau (Callback hell).
- **Error Handling:** Sử dụng một middleware xử lý lỗi tập trung. Ném các custom Error Classes (ví dụ: `AppError(404, 'Product not found')`) từ Controller hoặc Service để middleware hứng.

---

## 3. Kiến Trúc Thư Mục (Directory Architecture)

### 3.1. Backend Architecture (MVC + Service Pattern)
Chúng ta áp dụng mô hình phân lớp để dễ dàng bảo trì và scale:

```
backend/
├── src/
│   ├── config/        # Cấu hình hệ thống (Database, Environment vars)
│   ├── controllers/   # Xử lý Request/Response (Không chứa business logic)
│   ├── middlewares/   # Custom Express middlewares (Auth, Error Handler, Logger)
│   ├── models/        # Mongoose Schemas & Models
│   ├── routes/        # Định nghĩa API endpoints và map tới Controllers
│   ├── services/      # Business logic cốt lõi (Tương tác với Models)
│   ├── utils/         # Các hàm tiện ích (Helpers, Formatters)
│   └── app.ts         # Khởi tạo Express App
```
*Luồng đi của một request:* `Route` -> `Middleware` (Kiểm tra quyền) -> `Controller` (Nhận input) -> `Service` (Xử lý nghiệp vụ & gọi DB qua `Model`) -> `Controller` (Trả về JSON).

### 3.2. Frontend Architecture
```
frontend/
├── src/
│   ├── assets/        # Hình ảnh, fonts tĩnh
│   ├── components/    # Reusable UI components (Nút, Form, Modal)
│   ├── contexts/      # React Contexts (Global state)
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Các layout dùng chung (MainLayout, AuthLayout)
│   ├── pages/         # Các trang (Views) ứng với các route
│   ├── services/      # Các hàm gọi API (Tương tác với Backend)
│   ├── utils/         # Helper functions
│   └── App.tsx        # Cấu hình React Router
```

---

## 4. Thực Hành Tốt Nhất (Best Practices)

### 4.1. Về Bảo Mật (Security)
- **Xác thực và Phân quyền:** Phân quyền chặt chẽ các API endpoint. Không bao giờ tin tưởng input từ client.
- **Data Validation:** Validate mọi payload đầu vào sử dụng thư viện như `Zod` hoặc `Joi` trước khi xử lý.
- **Bảo vệ Database:** Tránh NoSQL Injection bằng cách sanitize input. Không bao giờ truyền trực tiếp `req.body` vào các hàm update của Mongoose.
- **Mật khẩu:** Luôn hash mật khẩu bằng `bcrypt` hoặc `argon2` trước khi lưu vào DB.
- **Environment Variables:** Không bao giờ hardcode các secret keys (JWT secret, DB URI, API keys) vào source code. Sử dụng file `.env`.
- **Bảo mật Header:** Sử dụng thư viện `helmet` cho Express backend để thiết lập các HTTP headers bảo mật. Cấu hình CORS chặt chẽ.

### 4.2. Về Hiệu Suất (Performance)
#### Backend:
- **Database Indexing:** Tạo index cho các trường thường xuyên dùng để tìm kiếm, sắp xếp hoặc filter trong MongoDB (như `email`, `productId`, `category`).
- **Pagination:** Luôn sử dụng phân trang (Pagination) cho các truy vấn trả về danh sách dữ liệu (ví dụ: danh sách sản phẩm, lịch sử đơn hàng). Hạn chế lấy tất cả dữ liệu cùng lúc.
- **Lean Query:** Sử dụng `.lean()` trong Mongoose khi chỉ cần đọc dữ liệu mà không cần chỉnh sửa/lưu lại object, giúp tăng tốc độ xử lý JSON đáng kể.

#### Frontend:
- **Code Splitting & Lazy Loading:** Sử dụng `React.lazy` và `Suspense` để chia nhỏ bundle theo route, giảm thời gian tải trang ban đầu.
- **Tối ưu hình ảnh:** Nén hình ảnh và sử dụng các định dạng hiện đại (WebP). Thêm thuộc tính `loading="lazy"` cho các ảnh không nằm trong viewport ban đầu.
- **Tránh Rerender không cần thiết:** Sử dụng `useMemo`, `useCallback` hoặc `React.memo` đúng chỗ để tránh các component con render lại khi state không liên quan thay đổi.
- **Debouncing:** Áp dụng debounce cho các event xảy ra liên tục (như gõ phím vào ô tìm kiếm sản phẩm).
