import mongoose from "mongoose";
import { ICartItem } from "./model.interfaces";

export interface ISyncCartBody {
  items: ICartItem[];
}

export interface IPopulatedCartItem {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  media: string[];
}

export interface IPopulatedCart {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: {
    _id: mongoose.Types.ObjectId;
    size: string;
    quantity: number;
    productId: IPopulatedCartItem;
  }[];
}

export interface IFormattedCart {
  productId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  image: string; // Định nghĩa rõ là string chứ không phải mảng media
  size: string;
  quantity: number;
}