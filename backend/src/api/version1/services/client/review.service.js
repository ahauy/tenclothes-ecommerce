"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByProductService = exports.createViewProductService = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const order_model_1 = require("../../../../models/order.model");
const review_model_1 = __importDefault(require("../../../../models/review.model"));
const createViewProductService = async ({ userId, productId, orderId, rating, content, images, }) => {
    // 1. TỐI ƯU QUERY: Gom 3 điều kiện vào 1 câu truy vấn Database
    const order = await order_model_1.Order.findOne({
        _id: orderId,
        userId: userId, // Đảm bảo đơn hàng thuộc về user này
        "items.productId": productId, // Đảm bảo sản phẩm này THỰC SỰ CÓ trong đơn hàng
    }).lean();
    if (!order) {
        throw new ApiError_1.default(404, "Không tìm thấy đơn hàng hợp lệ hoặc sản phẩm không thuộc đơn hàng này!");
    }
    // 2. BẢO MẬT LOGIC: Kiểm tra trạng thái đơn hàng (Rất quan trọng)
    if (order.orderStatus !== "delivered") {
        throw new ApiError_1.default(403, "Chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao thành công!");
    }
    // 3. Lấy thông tin phân loại hàng
    const itemProduct = order.items.find((item) => String(item.productId) === String(productId));
    const variantInfo = {
        color: itemProduct?.color || "",
        size: itemProduct?.size || "",
    };
    // 4. Khởi tạo và lưu Review
    const reviewNew = new review_model_1.default({
        userId,
        productId,
        orderId,
        rating,
        content,
        images: images || [],
        variantInfo,
    });
    await reviewNew.save();
    return reviewNew;
};
exports.createViewProductService = createViewProductService;
const getReviewsByProductService = async (productId) => {
    const reviews = await review_model_1.default.find({ productId: productId, status: "approved" })
        .sort({ createdAt: -1 })
        .populate("userId", "fullName avatar")
        .lean();
    return reviews;
};
exports.getReviewsByProductService = getReviewsByProductService;
//# sourceMappingURL=review.service.js.map