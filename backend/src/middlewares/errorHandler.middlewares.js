"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Global Error Handler Middleware
 * Bắt mọi lỗi không được xử lý trong pipeline của Express,
 * bao gồm cả lỗi "request aborted" từ raw-body/body-parser.
 */
const errorHandler = (err, _req, res, _next) => {
    // --- Xử lý lỗi "request aborted" (client ngắt kết nối giữa chừng) ---
    if (err.type === "request.aborted" || err.code === "ECONNABORTED") {
        console.warn("[WARN] Client đã ngắt kết nối trước khi server đọc xong request body.");
        // Không cần response vì client đã mất kết nối
        if (!res.headersSent) {
            res.status(400).json({
                status: false,
                message: "Yêu cầu bị hủy bởi client.",
                data: null,
            });
        }
        return;
    }
    // --- Xử lý lỗi payload quá lớn ---
    if (err.type === "entity.too.large") {
        console.warn("[WARN] Request body vượt quá giới hạn cho phép.");
        res.status(413).json({
            status: false,
            message: "Dữ liệu gửi lên quá lớn. Vui lòng giảm kích thước file.",
            data: null,
        });
        return;
    }
    // --- Xử lý lỗi JSON parse không hợp lệ ---
    if (err.type === "entity.parse.failed") {
        res.status(400).json({
            status: false,
            message: "Dữ liệu JSON không hợp lệ.",
            data: null,
        });
        return;
    }
    // --- Lỗi chung (fallback) ---
    const statusCode = err.status || 500;
    console.error(`[ERROR] ${err.message}`, err.stack);
    res.status(statusCode).json({
        status: false,
        message: statusCode === 500
            ? "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!"
            : err.message,
        data: null,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.middlewares.js.map