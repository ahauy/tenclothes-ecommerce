"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrdersService = exports.updateOrderService = exports.postOrderServiceClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const randomCode_1 = require("../../../../helpers/randomCode");
const order_model_1 = require("../../../../models/order.model");
const product_model_1 = __importDefault(require("../../../../models/product.model"));
const review_model_1 = __importDefault(require("../../../../models/review.model"));
const coupon_model_1 = require("../../../../models/coupon.model");
const coupon_service_1 = require("./coupon.service");
const postOrderServiceClient = async (payload, userId = null) => {
    const { customer, items, couponCode } = payload;
    let totalAmount = 0;
    const orderItems = [];
    const productIds = [];
    for (const item of items) {
        const product = await product_model_1.default.findById(item.productId);
        if (!product) {
            throw new ApiError_1.default(404, `Sản phẩm có ID: ${item.productId} không tồn tại hoặc đã bị xóa!`);
        }
        const style = product.productStyles?.find(s => s.colorName === item.color) || product.productStyles?.[0];
        totalAmount += product.salePrice * item.quantity;
        productIds.push(product._id.toString());
        orderItems.push({
            productId: product._id,
            sku: item.sku,
            slug: product.slug,
            title: product.title,
            price: product.price,
            salePrice: product.salePrice,
            color: item.color,
            size: item.size,
            image: style?.images[0] || "",
            quantity: item.quantity,
        });
    }
    // ── Áp dụng coupon (nếu có) ──
    let discountAmount = 0;
    let finalAmount = totalAmount;
    let appliedCouponCode = null;
    if (couponCode && couponCode.trim()) {
        // Validate lại lần 2 để chống race condition
        const couponResult = await (0, coupon_service_1.validateCouponService)(couponCode, userId, totalAmount, productIds);
        discountAmount = couponResult.discountAmount;
        finalAmount = couponResult.finalAmount;
        appliedCouponCode = couponResult.coupon.code;
    }
    // ── Tạo đơn hàng ──
    const newOrder = new order_model_1.Order({
        userId: userId,
        orderCode: (0, randomCode_1.randomCode)(8),
        customer: customer,
        items: orderItems,
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        couponCode: appliedCouponCode,
        orderStatus: "pending",
        paymentStatus: "unpaid",
    });
    const saveOrder = await newOrder.save();
    // ── CHỈ TRỪ KHO VÀ COUPON NẾU THANH TOÁN LÀ COD ──
    // (Nếu là MoMo, sẽ chờ webhook IPN xác nhận mới trừ để tránh mất lượt của khách)
    if (customer.paymentMethod === "cod") {
        // 1. Trừ lượt sử dụng mã giảm giá
        if (appliedCouponCode) {
            const updateQuery = { $inc: { usageCount: 1 } };
            if (userId) {
                updateQuery["$push"] = { usedBy: new mongoose_1.default.Types.ObjectId(userId) };
            }
            await coupon_model_1.Coupon.findOneAndUpdate({ code: appliedCouponCode }, updateQuery);
        }
        // 2. Trừ kho
        for (const item of items) {
            await product_model_1.default.updateOne({
                _id: item.productId,
                "variants.size": item.size,
                "variants.colorName": item.color
            }, {
                $inc: { "variants.$.stock": -item.quantity, sold: item.quantity },
            });
        }
    }
    return saveOrder;
};
exports.postOrderServiceClient = postOrderServiceClient;
const updateOrderService = async (orderId) => {
    const updatedOrder = await order_model_1.Order.findOneAndUpdate({ orderCode: orderId }, { paymentStatus: "paid", orderStatus: "processing" }, { returnDocument: "after" });
    return updatedOrder;
};
exports.updateOrderService = updateOrderService;
const getMyOrdersService = async (userId) => {
    const orders = await order_model_1.Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    const userReviews = await review_model_1.default.find({ userId: userId }).select("orderId productId").lean();
    const reviewedSet = new Set(userReviews.map(r => `${r.orderId.toString()}-${r.productId.toString()}`));
    const ordersWithReviewStatus = orders.map(order => ({
        ...order,
        items: order.items.map(item => ({
            ...item,
            isReviewed: reviewedSet.has(`${order._id.toString()}-${item.productId.toString()}`)
        }))
    }));
    return ordersWithReviewStatus;
};
exports.getMyOrdersService = getMyOrdersService;
//# sourceMappingURL=order.service.js.map