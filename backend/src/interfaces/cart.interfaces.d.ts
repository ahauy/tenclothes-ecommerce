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
    productStyles: IProductStyle[];
}
export interface IFormattedCart {
    productId: mongoose.Types.ObjectId | string;
    sku: string;
    slug: string;
    title: string;
    price: number;
    salePrice: number;
    color: string;
    size: string;
    image: string;
    quantity: number;
}
export interface IPopulatedCart {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    items: {
        productId: any;
        sku: string;
        color: string;
        size: string;
        quantity: number;
    }[];
}
//# sourceMappingURL=cart.interfaces.d.ts.map