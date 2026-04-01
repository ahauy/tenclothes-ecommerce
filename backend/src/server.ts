import app from "./app";
import { connectDB } from "./configs/database";

const PORT: string = process.env["PORT"] || "3000";

// Gọi hàm kết nối Database độc lập (chạy cho cả Local và Vercel)
connectDB().catch((e): void => {
  console.error("Không thể kết nối với database: ", e);
});

// Kiểm tra môi trường: Chỉ chạy app.listen nếu ĐANG Ở LOCAL
// Trên Vercel, NODE_ENV sẽ tự động được set là 'production'
if (process.env["NODE_ENV"] !== "production") {
  app.listen(PORT, (): void => {
    console.log("Server E-Commerce đang chạy tại cổng: ", PORT);
  });
}

// Bắt buộc phải export app ra để Vercel serverless function có thể đọc được
export default app;