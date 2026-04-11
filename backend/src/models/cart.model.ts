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
          require: true,
        },
        size: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
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
