# 🛍️ TenClothes — Fashion E-Commerce Platform

> **TenClothes** là một nền tảng thương mại điện tử thời trang full-stack được xây dựng theo kiến trúc **monorepo**, với backend RESTful API và frontend SPA hiện đại.  
> Thiết kế theo phong cách **"Quiet Luxury"** — tinh tế, tối giản và sang trọng.

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Kiến Trúc Dự Án](#-kiến-trúc-dự-án)
- [Tính Năng](#-tính-năng)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Biến Môi Trường](#-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Data Models](#-data-models)

---

## 🌟 Tổng Quan

TenClothes là ứng dụng thương mại điện tử thời trang hoàn chỉnh, hỗ trợ:

- Duyệt và tìm kiếm sản phẩm theo danh mục, màu sắc, kích cỡ
- Quản lý giỏ hàng và đặt hàng
- Thanh toán COD, Banking và MoMo
- Hệ thống đánh giá sản phẩm (sao, hình ảnh, trả lời của admin)
- Cổng thông tin tài khoản (hồ sơ, sổ địa chỉ, lịch sử đơn hàng)
- Bảng quản trị admin (quản lý sản phẩm, đơn hàng)

---

## 🛠️ Công Nghệ Sử Dụng

### Backend

| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js v5 |
| Database | MongoDB (Mongoose v9) |
| Authentication | JWT (Access Token + Refresh Token) |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Validation | Zod |
| Password Hashing | Bcrypt |
| Rate Limiting | express-rate-limit |

### Frontend

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| State Management | Zustand v5 |
| Data Fetching | Axios + SWR |
| Form Handling | React Hook Form + Zod |
| UI/Icons | Font Awesome |
| Notifications | Sonner + React Toastify |
| Slider | Swiper |

---

## 🏗️ Kiến Trúc Dự Án

```
ECOMERCE/
├── backend/          # RESTful API Server (Express + MongoDB)
└── frontend/         # SPA Client (React + Vite)
```

Backend được tổ chức theo mô hình **MVC** với phân tách rõ ràng giữa API client và admin, versioned API (`/api/version1`).

Frontend áp dụng **Feature-based architecture** với Zustand làm global state manager và SWR để cache dữ liệu từ server.

---

## ✨ Tính Năng

### 👤 Người Dùng (Client)

- **Trang Chủ** — Hero banner, Bộ sưu tập mới nhất, Sản phẩm bán chạy
- **Bộ Sưu Tập** — Lọc theo danh mục, màu sắc, giới tính, sắp xếp giá
- **Chi Tiết Sản Phẩm** — Gallery ảnh theo màu sắc, chọn size/màu, thêm giỏ hàng
- **Đánh Giá Sản Phẩm** — Viết review với ảnh, xem rating tổng hợp, trả lời của shop
- **Giỏ Hàng** — Thêm/xóa/cập nhật số lượng, preview real-time
- **Thanh Toán** — Điền thông tin giao hàng, chọn phương thức (COD / Banking / MoMo)
- **Lịch Sử Đơn Hàng** — Xem trạng thái đơn, hủy đơn, đánh giá sản phẩm sau khi nhận
- **Tìm Kiếm** — Full-text search theo tên và tags sản phẩm

### 🏛️ Cổng Tài Khoản (`/account`)

| Trang | Chức năng |
|---|---|
| **Hồ Sơ** | Cập nhật thông tin cá nhân, avatar, thông số (chiều cao, cân nặng) |
| **Sổ Địa Chỉ** | Thêm / Sửa / Xóa / Đặt mặc định địa chỉ giao hàng |
| **Đơn Hàng** | Xem lịch sử, trạng thái đơn, viết đánh giá sản phẩm |

### 🔐 Xác Thực

- Đăng ký tài khoản + xác thực email
- Đăng nhập / Đăng xuất
- JWT với Access Token (ngắn hạn) + Refresh Token (cookie httpOnly)
- Bảo vệ route với middleware xác thực

### 🛠️ Admin Panel

- Đăng nhập admin riêng biệt
- Quản lý sản phẩm (thêm / sửa / xóa)
- Quản lý đơn hàng (cập nhật trạng thái)

---

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas hoặc MongoDB local

### 1. Clone Repository

```bash
git clone <repository-url>
cd ECOMERCE
```

### 2. Cài Đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` theo mẫu ở phần [Biến Môi Trường](#-biến-môi-trường).

```bash
npm run dev
```

Server chạy tại: `http://localhost:3000`

### 3. Cài Đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev
```

App chạy tại: `http://localhost:5173`

---

## 🔑 Biến Môi Trường

### Backend (`.env`)

```env
# Database
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123!

# Cloudinary (Image Upload)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 📡 API Endpoints

Base URL: `/api/version1`

### Auth (Client)

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/logout` | Đăng xuất |
| `POST` | `/auth/refresh-token` | Làm mới Access Token |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại |

### Products

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/products` | Lấy danh sách sản phẩm (có filter, sort, pagination) |
| `GET` | `/products/:slug` | Lấy chi tiết sản phẩm theo slug |
| `GET` | `/products/search` | Tìm kiếm sản phẩm |

### Orders

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/orders` | Lấy danh sách đơn hàng của user |
| `GET` | `/orders/:id` | Lấy chi tiết đơn hàng |
| `PATCH` | `/orders/:id/cancel` | Hủy đơn hàng |

### Checkout

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/checkout` | Tạo đơn hàng mới |
| `POST` | `/checkout/momo` | Khởi tạo thanh toán MoMo |

### Cart

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/cart` | Lấy giỏ hàng |
| `POST` | `/cart/add` | Thêm sản phẩm vào giỏ |
| `PATCH` | `/cart/update` | Cập nhật số lượng |
| `DELETE` | `/cart/remove/:itemId` | Xóa sản phẩm khỏi giỏ |

### Reviews

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/reviews/:productId` | Lấy đánh giá của sản phẩm |
| `POST` | `/reviews` | Viết đánh giá (cần xác thực) |

### Users (Account)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/users/profile` | Lấy thông tin hồ sơ |
| `PATCH` | `/users/profile` | Cập nhật hồ sơ |
| `GET` | `/users/addresses` | Lấy sổ địa chỉ |
| `POST` | `/users/addresses` | Thêm địa chỉ mới |
| `PATCH` | `/users/addresses/:id` | Sửa địa chỉ |
| `DELETE` | `/users/addresses/:id` | Xóa địa chỉ |
| `PATCH` | `/users/addresses/:id/set-default` | Đặt địa chỉ mặc định |

### Admin

Base URL: `/api/version1/admin`

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/login` | Đăng nhập admin |
| `GET` | `/product` | Lấy tất cả sản phẩm |
| `POST` | `/product` | Thêm sản phẩm mới |
| `PATCH` | `/product/:id` | Cập nhật sản phẩm |
| `DELETE` | `/product/:id` | Xóa sản phẩm |

---

## 📁 Cấu Trúc Thư Mục

```
ECOMERCE/
│
├── backend/
│   └── src/
│       ├── api/
│       │   └── version1/
│       │       ├── controllers/    # Xử lý logic request/response
│       │       ├── routes/
│       │       │   ├── client/     # Routes cho người dùng
│       │       │   └── admin/      # Routes cho admin
│       │       ├── services/       # Business logic
│       │       └── validators/     # Zod validation schemas
│       ├── configs/                # Kết nối DB, Cloudinary
│       ├── constants/              # Hằng số dùng chung
│       ├── helpers/                # Hàm tiện ích
│       ├── interfaces/             # TypeScript interfaces
│       ├── middlewares/            # Auth, rate-limit middleware
│       ├── models/                 # Mongoose schemas
│       │   ├── user.model.ts
│       │   ├── product.model.ts
│       │   ├── order.model.ts
│       │   ├── cart.model.ts
│       │   ├── category.model.ts
│       │   ├── review.model.ts
│       │   └── account.model.ts
│       ├── app.ts                  # Express app setup
│       └── server.ts               # HTTP server entry point
│
└── frontend/
    └── src/
        ├── components/             # UI Components tái sử dụng
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── ProductItem.tsx
        │   ├── ProductReviews.tsx
        │   ├── ReviewModal.tsx
        │   ├── AddressFormModal.tsx
        │   └── ...
        ├── pages/                  # Trang chính
        │   ├── Home.tsx
        │   ├── Collection.tsx
        │   ├── Product.tsx
        │   ├── Cart.tsx
        │   ├── Order.tsx
        │   ├── Login.tsx
        │   ├── SignUp.tsx
        │   └── account/
        │       ├── Profile.tsx
        │       ├── Addresses.tsx
        │       └── Orders.tsx
        ├── layouts/                # Layout components
        │   └── AccountLayout.tsx
        ├── stores/                 # Zustand global state
        │   ├── useAuthStore.ts
        │   ├── useCartStore.ts
        │   ├── useCheckoutInforStore.ts
        │   ├── useCategoryStore.ts
        │   └── useShopStore.ts
        ├── services/               # API calls (Axios)
        ├── hooks/                  # Custom React hooks
        ├── interfaces/             # TypeScript types
        ├── validators/             # Zod form schemas
        ├── utils/                  # Hàm tiện ích
        └── constants/              # Hằng số frontend
```

---

## 🗄️ Data Models

### User

```
User {
  fullName, email, password (hashed)
  phone, gender, isActive
  info: { height, weight, dob }
  addresses: [{ name, phone, province, district, ward, address, isDefault }]
}
```

### Product

```
Product {
  title, slug, description, categoryId, brand, tags, gender
  price, discountPercentage, currency
  productStyles: [{ colorName, colorHex, images[], isDefault }]
  variants: [{ sku, colorName, size, stock, priceDifference }]
  totalStock, sold, averageRating, reviewCount
  isActive, isFeatured
}
```

### Order

```
Order {
  userId, orderCode
  customer: { fullName, email, phone, province, district, ward, detailAddress, paymentMethod }
  items: [{ productId, sku, title, price, salePrice, color, size, image, quantity }]
  totalAmount
  orderStatus: pending | processing | shipped | delivered | cancelled
  paymentStatus: unpaid | paid | refunded
}
```

### Review

```
Review {
  userId, productId, orderId
  rating (1-5), comment
  images[]
  adminReply: { content, repliedAt }
  isApproved
}
```

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Backend | Vercel (Serverless) |
| Frontend | Vercel |
| Database | MongoDB Atlas |
| Images | Cloudinary |

---

## 📝 License

MIT © 2025 TenClothes