"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    },
    orderCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    customer: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        // Tỉnh/Huyện/Xã ở client đang gửi dạng String ('1', '21') nên để String
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        detailAddress: { type: String, required: true },
        note: { type: String, default: "" },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["cod", "banking", "momo"],
            default: "cod",
        },
    },
    items: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product", // Reference đến model Product của bạn
                required: true,
            },
            sku: { type: String, required: true }, // Thêm trường SKU (Mã kho)
            slug: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            salePrice: { type: Number, required: true },
            color: { type: String, required: true }, // Thêm trường Màu sắc
            size: { type: String, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    // Fields liên quan đến coupon
    couponCode: {
        type: String,
        default: null,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        default: null,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "refunded"],
        default: "unpaid",
    },
}, {
    timestamps: true, // Tự động tạo createdAt và updatedAt
});
exports.Order = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=order.model.js.map