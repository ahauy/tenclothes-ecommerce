import mongoose from "mongoose";
import { IProduct } from "../interfaces/model.interfaces";

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    categoryIds: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Category",
      type: [String],
      required: true,
    },
    price: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ["$", "VND", "EUR"],
      default: "$",
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    salePrice: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "male",
    },
    variants: [
      {
        sku: { type: String },
        color: { type: String },
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
        imageUrl: { type: String },
      },
    ],
    media: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema, "products");

export default Product;
