# 🛒 TenClothes - Fullstack E-Commerce Platform

TenClothes là một nền tảng thương mại điện tử hoàn chỉnh được xây dựng để cung cấp trải nghiệm mua sắm mượt mà cho người dùng và hệ thống quản trị mạnh mẽ cho admin. Dự án được phát triển theo kiến trúc Monorepo, phân tách rõ ràng giữa Client UI và Admin Dashboard.

## 🚀 Trải nghiệm dự án (Live Demo)

Dự án đã được deploy toàn bộ lên Vercel. 

* **🌐 Website (Dành cho Khách hàng):** https://tenclothes-ecommerce-fontend.vercel.app
* **⚙️ Admin Dashboard (Dành cho Quản lý):** https://tenclothes-ecommerce-backend.vercel.app/api/version1/
* **🔗 API Server (Backend):** [Điền link Backend Vercel của bạn vào đây]

> **💡 Dành cho Nhà Tuyển Dụng (Test Accounts):**
> Nhằm tiết kiệm thời gian đánh giá, anh/chị có thể sử dụng các tài khoản có sẵn dưới đây:
> * **Tài khoản Quản trị (Admin):** `vutuanhau.haui@gmail.com` | Mật khẩu: `Hauhamhoc123!`

---

## 📖 Hướng dẫn trải nghiệm nhanh (Kịch bản Test)

Để trải nghiệm đầy đủ luồng hoạt động của hệ thống, anh/chị có thể thử theo 2 kịch bản sau:

### Kịch bản 1: Đóng vai Người mua hàng (User)
1. Truy cập vào trang **Website Frontend**.
2. Sử dụng **Tài khoản Khách hàng** ở trên để đăng nhập (Hệ thống xác thực bằng JWT an toàn).
3. Dạo vòng quanh trang chủ, sử dụng thanh tìm kiếm hoặc bộ lọc để tìm sản phẩm yêu thích.
4. Click vào một sản phẩm để xem chi tiết, chọn kích cỡ/màu sắc và nhấn **Thêm vào giỏ hàng**.
5. Mở Giỏ hàng, điều chỉnh số lượng sản phẩm.
6. Tiến hành **Đặt hàng (Checkout)** để xem luồng lưu trữ đơn hàng vào hệ thống.

### Kịch bản 2: Đóng vai Người Quản trị (Admin)
1. Truy cập vào trang **Admin Dashboard** và đăng nhập bằng **Tài khoản Quản trị**.
2. **Quản lý Sản phẩm:** * Thử tạo mới một sản phẩm.
   * Upload một bức ảnh bất kỳ từ máy tính (Ảnh sẽ được xử lý qua Multer memoryStorage và lưu trữ trực tiếp lên hệ thống **Cloudinary**).

---

## ✨ Các tính năng cốt lõi

* **Authentication & Authorization:** Bảo mật API với JSON Web Tokens (Access Token & Refresh Token), phân quyền chặt chẽ giữa User và Admin.
* **Tối ưu hình ảnh:** Tích hợp Cloudinary API để lưu trữ và tối ưu hóa hình ảnh tải lên.
* **Quản lý trạng thái:** Sử dụng [Điền tên thư viện quản lý state bạn dùng, ví dụ: Redux Toolkit / Zustand / React Context] để quản lý giỏ hàng và thông tin đăng nhập mượt mà.
* **Responsive Design:** Giao diện tương thích hoàn toàn trên cả Desktop và Mobile với Tailwind CSS.
* **Bảo mật:** Implement Rate Limiting, CORS configuration và Data Validation.

---

## 🛠 Tech Stack (Công nghệ sử dụng)

* **Frontend:** React.js (Vite), TypeScript, Tailwind CSS, Axios, React Router DOM.
* **Backend:** Node.js, Express.js, TypeScript.
* **Database:** MongoDB (Mongoose ORM).
* **Cloud Storage:** Cloudinary.
* **Deployment:** Vercel (Serverless Functions).

---

## 💻 Hướng dẫn chạy dự án ở Local (Local Development)

*(Dành cho các Developer muốn clone và phát triển thêm)*

**1. Clone Repository & Cài đặt thư viện:**
\`\`\`bash
git clone https://github.com/vutuanhau/ecommerce-tenclothes.git
cd ecommerce-tenclothes

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
\`\`\`

**2. Cấu hình biến môi trường:**
Tạo file `.env` tại thư mục `backend/`:
\`\`\`env
MONGODB_URL=mongodb+srv://e-commerce_db_user:LvW6DWEQ4goRp4cG@cluster0.nfyidlt.mongodb.net/e-commerce_manager?appName=Cluster0
PORT=3000
FRONTEND_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=ASDFASFASDFASUODFHO
REFRESH_TOKEN_SECRET=SFASLDFHOAHGHAHGOUAHSGOHO
ADMIN_EMAIL=vutuanhau.haui@gmail.com
ADMIN_PASSWORD=Hauhamhoc123!
CLOUDINARY_NAME=dbr8yqstc
CLOUDINARY_API_KEY=455566969665733
CLOUDINARY_SECRET=qtNo1QiA0apjGN5WjpjgM7cPiuE
\`\`\`
Tạo file `.env.development` tại thư mục `frontend/`:
\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

**3. Khởi động hệ thống:**
Mở 2 terminal song song:
* Terminal 1: `cd backend && npm run dev`
* Terminal 2: `cd frontend && npm run dev`

---

## 👨‍💻 Tác giả
* **Vũ Tuấn Hậu**
* **Email:** [vutuanhau.haui@gmail.com](vutuanhau.haui@gmail.com)
* **Portfolio/GitHub:** [https://github.com/vutuanhau](https://github.com/vutuanhau)