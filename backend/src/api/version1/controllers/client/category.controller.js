"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryTreeClient = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const category_service_1 = require("../../services/client/category.service");
const categoryTreeClient = async (_req, res) => {
    try {
        const categoryTree = await (0, category_service_1.categoryTreeClientService)();
        res.status(200).json({
            status: true,
            message: "Lấy cây thư mục thành công!",
            data: categoryTree
        });
    }
    catch (error) {
        console.error("Có lỗi trong loginController: ", error);
        // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message, // Sẽ in ra "Email đã được sử dụng!"
            });
            return;
        }
        // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.categoryTreeClient = categoryTreeClient;
//# sourceMappingURL=category.controller.js.map