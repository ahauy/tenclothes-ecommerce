import { createServer } from "http";
import app from "./app";
import { connectDB } from "./configs/database";
import { Server } from "socket.io";


const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Expose io to controllers
app.set("io", io);

const PORT: string = process.env["PORT"] || "3000";



// Gọi hàm kết nối Database độc lập (chạy cho cả Local và Vercel)
connectDB().catch((e): void => {
  console.error("Không thể kết nối với database: ", e);
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Lắng nghe sự kiện ngắt kết nối
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

// Kiểm tra môi trường: Chỉ chạy app.listen nếu ĐANG Ở LOCAL
// Trên Vercel, NODE_ENV sẽ tự động được set là 'production'
if (process.env["NODE_ENV"] !== "production") {
  server.listen(PORT, (): void => {
    console.log("Server E-Commerce đang chạy tại cổng: ", PORT);
  });
}

// Bắt buộc phải export app ra để Vercel serverless function có thể đọc được
export default app;