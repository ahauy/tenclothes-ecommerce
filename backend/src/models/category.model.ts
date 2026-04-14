import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/model.interfaces";

const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Tham chiếu chính nó để tạo cấu trúc cha-con
      default: null,   // Nếu null nghĩa là nó là Danh mục gốc (Level 1)
    },
    level: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Tối ưu hóa truy vấn
// categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

export const Category = mongoose.model<ICategory>("Category", categorySchema, "categories");