import mongoose, { Schema } from "mongoose";
import { IProductLog } from "../interfaces/model.interfaces";

const productLogSchema = new Schema<IProductLog>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "RESTORE", "CHANGE_STATUS", "CHANGE_FEATURED"],
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    actorInfo: {
      fullName: { type: String, required: true },
      role: { type: String, required: true },
      email: { type: String, required: true },
    },
    changes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

productLogSchema.index({ productId: 1, createdAt: -1 });

const ProductLog = mongoose.model<IProductLog>("ProductLog", productLogSchema, "product_logs");

export default ProductLog;
