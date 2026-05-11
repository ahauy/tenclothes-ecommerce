"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByProduct = exports.createReviewProduct = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const review_service_1 = require("../../services/client/review.service");
const createReviewProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, orderId, rating, content } = req.body;
        const images = req.body.cloudinaryUrls || [];
        const reviewNew = await (0, review_service_1.createViewProductService)({
            userId,
            productId,
            orderId,
            rating,
            content,
            images,
        });
        res.status(201).json({
            status: true,
            message: "Đánh giá sản phẩm thành công!",
            data: reviewNew,
        });
    }
    catch (error) {
        // Định nghĩa type any hoặc bắt type cho error
        console.error("Có lỗi trong createReviewProduct: ", error);
        // 5. BẢO MẬT HIỆU SUẤT: Xử lý lỗi trùng lặp từ MongoDB (Mã 11000)
        // Nếu user spam click hoặc cố tình gửi request liên tục
        if (error.code === 11000) {
            res.status(400).json({
                status: false,
                message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!",
            });
            return;
        }
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message,
            });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.createReviewProduct = createReviewProduct;
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await (0, review_service_1.getReviewsByProductService)(productId);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách đánh giá thành công",
            data: reviews
        });
    }
    catch (error) {
        console.error("Lỗi getReviewsByProduct: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getReviewsByProduct = getReviewsByProduct;
//# sourceMappingURL=review.controller.js.map