"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res
                .status(401)
                .json({
                message: "Không tìm thấy Access Token! Vui lòng đăng nhập lại!",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decode = jsonwebtoken_1.default.verify(token, process.env["ACCESS_TOKEN_SECRET"]);
        req.user = {
            _id: decode._id,
            email: decode.email,
            fullName: decode["fullName"],
            ...(decode.role && { role: decode.role })
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authen.middlewares.js.map