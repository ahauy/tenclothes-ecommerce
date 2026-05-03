import mongoose, { Schema, Document } from "mongoose";

export interface IProductLog extends Document {
  productId: mongoose.Types.ObjectId;
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "CHANGE_STATUS" | "CHANGE_FEATURED";
  performedBy: mongoose.Types.ObjectId;
  actorInfo: {
    fullName: string;
    role: string;
    email: string;
  };
  changes?: {
    [key: string]: {
      from: any;
      to: any;
    };
  };
  createdAt: Date;
}

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
      ref: "Staff",
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
