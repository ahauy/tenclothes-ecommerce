import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/model.interfaces";

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);