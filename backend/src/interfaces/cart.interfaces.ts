import mongoose from "mongoose";
import { ICartItem, IProductStyle } from "./model.interfaces";

export interface ISyncCartBody {
  items: ICartItem[];
}

export interface IPopulatedCartItem {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  productStyles: IProductStyle[]
}

// Cập nhật IFormattedCart (Dữ liệu trả về cho Frontend)
export interface IFormattedCart {
  productId: mongoose.Types.ObjectId | string;
  sku: string;       // Bổ sung dòng này
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string;     // Bổ sung dòng này
  size: string;
  image: string;
  quantity: number;
}

// Nếu bạn có IPopulatedCart thì cũng cập nhật mảng items của nó
export interface IPopulatedCart {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: any; // Chứa nguyên object Product đã được populate
    sku: string;    // Bổ sung
    color: string;  // Bổ sung
    size: string;
    quantity: number;
  }[];
}