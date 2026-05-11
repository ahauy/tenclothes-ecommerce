"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./configs/database");
const socket_io_1 = require("socket.io");
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});
// Expose io to controllers
app_1.default.set("io", io);
const PORT = process.env["PORT"] || "3000";
// Gọi hàm kết nối Database độc lập (chạy cho cả Local và Vercel)
(0, database_1.connectDB)().catch((e) => {
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
    server.listen(PORT, () => {
        console.log("Server E-Commerce đang chạy tại cổng: ", PORT);
    });
}
// Bắt buộc phải export app ra để Vercel serverless function có thể đọc được
exports.default = app_1.default;
//# sourceMappingURL=server.js.map