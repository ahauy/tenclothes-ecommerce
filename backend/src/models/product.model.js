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
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    // Thông tin cơ bản & SEO
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    categoryIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    ],
    brand: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    gender: {
        type: String,
        enum: ["male", "female", "unisex"],
        default: "unisex",
    },
    // Giá cả
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["$", "VND", "EUR"], default: "VND" },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    // Dữ liệu hiển thị UI (Màu sắc & Thư viện ảnh)
    productStyles: [
        {
            colorName: { type: String, required: true, trim: true },
            colorHex: { type: String, required: true, trim: true },
            images: [{ type: String, required: true }],
            isDefault: { type: Boolean, default: false },
        },
    ],
    // Dữ liệu quản lý kho thực tế
    variants: [
        {
            sku: {
                type: String,
                required: true,
                trim: true,
                unique: true,
                sparse: true,
            },
            colorName: { type: String, required: true, trim: true },
            size: { type: String, required: true, trim: true },
            stock: { type: Number, default: 0, min: 0 },
            priceDifference: { type: Number, default: 0 },
        },
    ],
    // Dữ liệu tổng hợp (Aggregated Data)
    totalStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    // Vận chuyển
    weight: { type: Number, default: 0 },
    // Trạng thái hiển thị & Xóa mềm
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Quan trọng: Đảm bảo Virtual fields xuất hiện khi res.json()
    toObject: { virtuals: true },
});
// Tự động tính giá bán (Sale Price) dựa trên phần trăm giảm giá
productSchema.virtual("salePrice").get(function () {
    if (this.discountPercentage && this.discountPercentage > 0) {
        return Math.round(this.price - this.price * (this.discountPercentage / 100));
    }
    return this.price;
});
// Tự động cộng tổng số lượng tồn kho trước khi lưu vào DB
productSchema.pre("save", async function () {
    if (this.isModified("variants")) {
        this.totalStock = this.variants.reduce((total, variant) => {
            return total + (variant.stock || 0);
        }, 0);
    }
});
// Đánh index cho các trường hay dùng để tìm kiếm, lọc dữ liệu
// productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1 });
// productSchema.index({ "variants.sku": 1 });
productSchema.index({ title: "text", tags: "text" }); // Phục vụ Full-text search
const Product = mongoose_1.default.model("Product", productSchema, "products");
exports.default = Product;
//# sourceMappingURL=product.model.js.map