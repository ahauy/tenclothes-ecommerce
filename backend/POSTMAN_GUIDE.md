# Hướng dẫn sử dụng Postman Collection cho TenClothes E-Commerce

Chào bạn! Dưới đây là tài liệu và hướng dẫn sử dụng Postman Collection cho dự án E-Commerce TenClothes.

Postman Collection đã được lưu tại: [TenClothes_Ecommerce.postman_collection.json](file:///Users/vutuanhau/Documents/PROJECT/ECOMERCE/backend/TenClothes_Ecommerce.postman_collection.json)

---

## 🚀 1. Hướng dẫn Import vào Postman

1. Mở ứng dụng **Postman**.
2. Chọn nút **Import** ở góc trên cùng bên trái (hoặc bấm tổ hợp phím `Ctrl + O` / `Cmd + O`).
3. Kéo và thả file [TenClothes_Ecommerce.postman_collection.json](file:///Users/vutuanhau/Documents/PROJECT/ECOMERCE/backend/TenClothes_Ecommerce.postman_collection.json) vào vùng Import.
4. Nhấn **Import** để xác nhận.

---

## 🔑 2. Cấu hình Biến môi trường (Variables)

Bộ sưu tập đi kèm với 3 biến Collection Variables được cấu hình sẵn:
- `baseUrl`: Địa chỉ máy chủ backend. Mặc định là `http://localhost:3000`. Bạn có thể cập nhật giá trị này trong tab *Variables* của Collection nếu chạy ở môi trường khác (ví dụ: ngrok hoặc Vercel).
- `clientToken`: Access Token dành cho ứng dụng **Client** (Người dùng).
- `adminToken`: Access Token dành cho ứng dụng **Admin** (Quản trị viên/Nhân viên).

### 🤖 Cơ chế tự động lưu Token (Automatic Token Saving)
- Khi bạn thực hiện request **Client/Auth/Login** thành công, Postman sẽ tự động chạy script kiểm tra và lưu `accessToken` thu được vào biến `clientToken`. Các request tiếp theo yêu cầu xác thực trong thư mục **Client** sẽ tự động kế thừa token này.
- Tương tự, khi bạn thực hiện request **Admin/Auth/Login** thành công, Postman sẽ tự động lưu token vào biến `adminToken`. Các request yêu cầu quyền quản trị trong thư mục **Admin** sẽ tự động sử dụng token đó.

---

## 🗺️ 3. Danh sách các API Endpoints chi tiết

### 🛒 A. Phân hệ Khách hàng (Client APIs)

*Các API yêu cầu đăng nhập sẽ tự động đính kèm header `Authorization: Bearer {{clientToken}}`.*

| Nhóm chức năng | Tên Request | Method | Endpoint | Auth | Ghi chú |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Auth** | Đăng ký | `POST` | `/api/version1/auth/register` | ❌ | Đăng ký tài khoản khách hàng mới |
| | Đăng nhập | `POST` | `/api/version1/auth/login` | ❌ | Lưu tự động `clientToken` |
| | Làm mới Token | `POST` | `/api/version1/auth/refresh-token` | ❌ | Dùng cookie refresh token |
| | Đăng xuất | `POST` | `/api/version1/auth/logout` | ❌ | Xoá cookie |
| | Quên mật khẩu | `POST` | `/api/version1/auth/password/forgot` | ❌ | Gửi OTP qua email |
| | Xác thực OTP | `POST` | `/api/version1/auth/password/otp` | ❌ | Kiểm tra OTP |
| | Đặt lại mật khẩu | `POST` | `/api/version1/auth/password/reset` | ❌ | Đặt mật khẩu mới bằng OTP |
| **Products** | Xem theo danh mục | `GET` | `/api/version1/products/category/:slug` | ❌ | `slug`: Ví dụ `ao-thun` |
| | Lấy bộ lọc danh mục | `GET` | `/api/version1/products/category/:slug/filters` | ❌ | Hỗ trợ phân trang, sắp xếp |
| | Bộ sưu tập mới nhất | `GET` | `/api/version1/products/latest-collection` | ❌ | Top sản phẩm mới |
| | Bán chạy nhất | `GET` | `/api/version1/products/best-selling` | ❌ | Top sản phẩm bán chạy |
| | Sản phẩm liên quan | `GET` | `/api/version1/products/related-collection` | ❌ | Truyền query `productId` |
| | Tìm kiếm sản phẩm | `GET` | `/api/version1/products/search` | ❌ | Truyền query `keyword` |
| | Chi tiết sản phẩm | `GET` | `/api/version1/products/:slug` | ❌ | `slug`: Slug sản phẩm |
| **Cart** | Validate giỏ hàng local | `POST` | `/api/version1/cart/local-validate` | ❌ | Check số lượng tồn kho |
| | Đồng bộ giỏ hàng | `POST` | `/api/version1/cart/sync` | `clientToken` | Đồng bộ database |
| | Thêm vào giỏ hàng | `POST` | `/api/version1/cart/add` | `clientToken` | |
| | Cập nhật số lượng | `PATCH` | `/api/version1/cart/update` | `clientToken` | |
| | Xóa khỏi giỏ hàng | `PATCH` | `/api/version1/cart/remove` | `clientToken` | |
| **Category** | Lấy cây danh mục | `GET` | `/api/version1/category/tree` | ❌ | Render menu |
| **Checkout** | Chi tiết thành công | `GET` | `/api/version1/checkout/success/:id` | ❌ | `:id` là ID đơn hàng |
| **Coupons** | Danh sách mã giảm giá| `GET` | `/api/version1/coupons` | ❌ | Các mã đang hoạt động |
| | Kiểm tra mã giảm giá | `POST` | `/api/version1/coupons/validate` | ❌ | Kiểm tra tính khả dụng |
| **Orders** | Đặt hàng | `POST` | `/api/version1/orders` | `clientToken` | Tạo đơn COD hoặc MoMo |
| | Webhook MoMo IPN | `POST` | `/api/version1/orders/momo-ipn` | ❌ | Cho MoMo gọi callback |
| | Đơn hàng của tôi | `GET` | `/api/version1/orders/my-orders` | `clientToken` | Lịch sử mua hàng |
| | Hủy đơn hàng | `PATCH` | `/api/version1/orders/:orderCode/cancel`| `clientToken` | Điền lý do hủy |
| | Mua lại đơn hàng | `POST` | `/api/version1/orders/:orderCode/repurchase`| `clientToken`| Thêm lại giỏ hàng |
| **Reviews** | Viết đánh giá sản phẩm | `POST` | `/api/version1/reviews` | `clientToken` | Multipart (upload hình ảnh) |
| | Xem đánh giá sản phẩm | `GET` | `/api/version1/reviews/:productId` | ❌ | Danh sách review đã duyệt |
| **Profile & Address** | Xem thông tin cá nhân | `GET` | `/api/version1/users/profile` | `clientToken` | |
| | Cập nhật thông tin | `PATCH` | `/api/version1/users/profile` | `clientToken` | |
| | Thay đổi mật khẩu | `PATCH` | `/api/version1/users/change-password` | `clientToken` | |
| | Danh sách địa chỉ | `GET` | `/api/version1/users/addresses` | `clientToken` | |
| | Thêm địa chỉ mới | `POST` | `/api/version1/users/addresses` | `clientToken` | |
| | Sửa địa chỉ | `PATCH` | `/api/version1/users/addresses/:addressId`| `clientToken`| |
| | Xóa địa chỉ | `DELETE`| `/api/version1/users/addresses/:addressId`| `clientToken`| |
| | Đặt địa chỉ mặc định | `PATCH` | `/api/version1/users/addresses/:addressId/set-default`| `clientToken`| |

---

### 👑 B. Phân hệ Quản trị (Admin APIs)

*Các API yêu cầu đăng nhập quản trị sẽ tự động đính kèm header `Authorization: Bearer {{adminToken}}`.*

| Nhóm chức năng | Tên Request | Method | Endpoint | Quyền hạn tối thiểu |
| :--- | :--- | :--- | :--- | :---: |
| **Auth** | Đăng nhập | `POST` | `/api/version1/admin/auth/login` | Tự động lưu `adminToken` |
| | Làm mới Token | `POST` | `/api/version1/admin/auth/refresh-token` | Sử dụng HTTPOnly Cookie |
| | Đăng xuất | `POST` | `/api/version1/admin/auth/logout` | Xóa cookie |
| **Dashboard** | Thống kê số liệu | `GET` | `/api/version1/admin/dashboard/stats` | Admin hoặc Employee |
| | Xuất file Excel | `GET` | `/api/version1/admin/dashboard/export` | Admin hoặc Employee |
| **Products** | Danh sách sản phẩm | `GET` | `/api/version1/admin/products` | Admin |
| | Thêm mới sản phẩm | `POST` | `/api/version1/admin/products/create` | Admin |
| | Cập nhật sản phẩm | `PATCH` | `/api/version1/admin/products/update/:slug`| Admin |
| | Thay đổi trạng thái | `PATCH` | `/api/version1/admin/products/change-status/:slug`| Admin |
| | Thay đổi nổi bật | `PATCH` | `/api/version1/admin/products/change-featured/:slug`| Admin |
| | Xóa sản phẩm (Soft) | `DELETE`| `/api/version1/admin/products/delete/:slug`| Admin |
| | Khôi phục sản phẩm | `PATCH` | `/api/version1/admin/products/restore/:slug`| Admin hoặc Employee |
| | Lịch sử chỉnh sửa | `GET` | `/api/version1/admin/products/history/:slug`| Admin hoặc Employee |
| | Thay đổi trạng thái loạt| `PATCH` | `/api/version1/admin/products/batch/change-status`| Admin |
| | Thay đổi nổi bật loạt | `PATCH` | `/api/version1/admin/products/batch/change-featured`| Admin |
| | Xóa sản phẩm hàng loạt | `POST` | `/api/version1/admin/products/batch/delete`| Admin |
| **Category** | Cây danh mục Admin | `GET` | `/api/version1/admin/category` | Admin |
| **Orders** | Thống kê đơn hàng | `GET` | `/api/version1/admin/orders/stats` | Admin hoặc Employee |
| | Danh sách đơn hàng | `GET` | `/api/version1/admin/orders` | Admin hoặc Employee |
| | Chi tiết đơn hàng | `GET` | `/api/version1/admin/orders/:id` | Admin hoặc Employee |
| | Cập nhật trạng thái đơn| `PATCH` | `/api/version1/admin/orders/:id/status`| Admin |
| | Cập nhật trạng thái loạt| `PATCH` | `/api/version1/admin/orders/batch/status`| Admin |
| | Xóa đơn hàng loạt | `DELETE`| `/api/version1/admin/orders/batch` | Admin |
| | Xóa một đơn hàng | `DELETE`| `/api/version1/admin/orders/:id` | Admin |
| **Reviews** | Danh sách review | `GET` | `/api/version1/admin/reviews` | Admin |
| | Duyệt review | `PATCH` | `/api/version1/admin/reviews/approve/:id`| Admin |
| | Từ chối review | `PATCH` | `/api/version1/admin/reviews/reject/:id`| Admin |
| | Cảnh cáo User (Strike) | `POST` | `/api/version1/admin/reviews/strike/:id`| Admin |
| | Xóa review | `DELETE`| `/api/version1/admin/reviews/:id` | Admin |
| **Staffs** | Danh sách nhân viên | `GET` | `/api/version1/admin/staffs` | Admin hoặc Employee |
| | Thêm mới nhân viên | `POST` | `/api/version1/admin/staffs/create` | Admin |
| | Cập nhật nhân viên | `PATCH` | `/api/version1/admin/staffs/:id` | Admin |
| | Xóa tài khoản nv | `DELETE`| `/api/version1/admin/staffs/:id` | Admin |
| **Users** | Danh sách khách hàng | `GET` | `/api/version1/admin/user` | Admin hoặc Employee |
| | Chi tiết khách hàng | `GET` | `/api/version1/admin/user/:id` | Admin hoặc Employee |
| | Cập nhật trạng thái KH | `PATCH` | `/api/version1/admin/user/status/:id`| Admin hoặc Employee |
| | Xóa khách hàng | `DELETE`| `/api/version1/admin/user/:id` | Admin hoặc Employee |
| **Upload** | Upload ảnh | `POST` | `/api/version1/admin/upload` | Admin (Lên Cloudinary) |
