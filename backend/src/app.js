"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const index_routes_1 = __importDefault(require("./api/version1/routes/client/index.routes"));
const index_routes_2 = __importDefault(require("./api/version1/routes/admin/index.routes"));
const errorHandler_middlewares_1 = require("./middlewares/errorHandler.middlewares");
const app = (0, express_1.default)();
// middleware parse json
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Lấy URL frontend từ biến môi trường (ví dụ: https://tenclothes-frontend.vercel.app)
const FRONTEND_URL = process.env["FRONTEND_URL"] || "http://localhost:5173";
const FRONTEND_URL_ADMIN = process.env["FRONTEND_URL_ADMIN"] || "http://localhost:5174";
// Cấu hình cors linh hoạt
app.use((0, cors_1.default)({
    origin: [FRONTEND_URL, FRONTEND_URL_ADMIN, "http://localhost:5173", "http://localhost:5174"], // Cho phép cả URL frontend và localhost
    credentials: true
}));
// routes api in version1
(0, index_routes_1.default)(app);
(0, index_routes_2.default)(app);
// Global error handler — phải đặt SAU tất cả routes
app.use(errorHandler_middlewares_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map