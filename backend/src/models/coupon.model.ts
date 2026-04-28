import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../interfaces/model.interfaces";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Rỗng = áp dụng cho tất cả sản phẩm; có phần tử = chỉ áp dụng cho những sản phẩm đó
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh theo code
// couponSchema.index({ code: 1 });

export const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);
