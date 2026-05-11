"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryTreeAdmin = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const category_service_1 = require("../../services/admin/category.service");
const categoryTreeAdmin = async (_req, res) => {
    try {
        const categoryTree = await (0, category_service_1.categoryTreeAdminService)();
        res.status(200).json({
            status: true,
            message: "Lấy cây thư mục thành công!",
            data: categoryTree
        });
    }
    catch (error) {
        console.error("Có lỗi trong categoryTreeAdmin: ", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
            });
            return;
        }
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.categoryTreeAdmin = categoryTreeAdmin;
//# sourceMappingURL=category.controller.js.map