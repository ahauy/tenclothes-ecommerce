import mongoose, { Schema } from "mongoose";
import { ICart } from "../interfaces/model.interfaces";

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true, // Đã sửa từ require -> required
        },
        sku: {
          type: String, // Thêm mã SKU
        },
        color: {
          type: String,
          required: true, // Bắt buộc phải lưu màu sắc
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);