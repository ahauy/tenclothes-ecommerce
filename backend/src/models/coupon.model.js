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
exports.Coupon = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ["fixed", "percentage"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, "Giá trị giảm phải >= 0"],
    },
    // Chỉ có ý nghĩa khi discountType = "percentage"
    maxDiscountAmount: {
        type: Number,
        default: null,
    },
    minOrderAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    maxUsage: {
        type: Number,
        required: true,
        default: 1,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    // Danh sách userId đã dùng mã này (mỗi user chỉ dùng 1 lần)
    usedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    // Rỗng = áp dụng cho tất cả sản phẩm; có phần tử = chỉ áp dụng cho những sản phẩm đó
    applicableProducts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    expiresAt: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Index để tìm kiếm nhanh theo code
// couponSchema.index({ code: 1 });
exports.Coupon = mongoose_1.default.model("Coupon", couponSchema);
//# sourceMappingURL=coupon.model.js.map