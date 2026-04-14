import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/model.interfaces";

const productSchema = new Schema<IProduct>(
  {
    // Thông tin cơ bản & SEO
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Quan trọng: Đảm bảo Virtual fields xuất hiện khi res.json()
    toObject: { virtuals: true },
  }
);

// Tự động tính giá bán (Sale Price) dựa trên phần trăm giảm giá
productSchema.virtual("salePrice").get(function () {
  if (this.discountPercentage && this.discountPercentage > 0) {
    return Math.round(
      this.price - this.price * (this.discountPercentage / 100)
    );
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

const Product = mongoose.model<IProduct>("Product", productSchema, "products");

export default Product;
