import mongoose, { Document } from "mongoose";
export interface IAddresses extends mongoose.Types.Subdocument {
    name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    isDefault: boolean;
}
interface IInfo {
    height?: string;
    weight?: string;
    dob?: string;
}
type IGender = "male" | "female" | "other";
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    deleted: boolean;
    phone?: string;
    gender?: IGender;
    info?: IInfo;
    addresses?: mongoose.Types.DocumentArray<IAddresses>;
    isActive: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IAccount extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    avatar: string;
    role: string;
    isActive: boolean;
    deleted: boolean;
}
export interface IProductStyle {
    colorName: string;
    colorHex: string;
    images: string[];
    isDefault: boolean;
}
export interface IProductVariant {
    sku: string;
    colorName: string;
    size: string;
    stock: number;
    priceDifference: number;
}
export interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    categoryIds: mongoose.Types.ObjectId[];
    brand?: string;
    tags: string[];
    price: number;
    currency: string;
    discountPercentage: number;
    salePrice: number;
    gender: "male" | "female" | "unisex";
    productStyles: IProductStyle[];
    variants: IProductVariant[];
    totalStock: number;
    sold: number;
    averageRating: number;
    reviewCount: number;
    weight: number;
    isActive: boolean;
    isFeatured: boolean;
    deleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrderProductItem {
    productId: mongoose.Types.ObjectId;
    sku: string;
    slug: string;
    title: string;
    price: number;
    salePrice: number;
    color: string;
    size: string;
    image: string;
    quantity: number;
    isOutOfStock?: boolean;
    isReviewed?: boolean;
}
export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    sku?: string;
    color: string;
    size: string;
    quantity: number;
}
export interface ICart extends Document {
    userId?: mongoose.Types.ObjectId;
    items: ICartItem[];
}
export interface IOrder extends Document {
    userId?: mongoose.Types.ObjectId;
    orderCode: string;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        province: string;
        district: string;
        ward: string;
        detailAddress: string;
        note?: string;
        paymentMethod: "cod" | "banking" | "momo";
    };
    items: IOrderProductItem[];
    totalAmount: number;
    discountAmount?: number;
    finalAmount?: number;
    couponCode?: string;
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "unpaid" | "paid" | "refunded";
    createdAt: Date;
    updatedAt: Date;
}
export type DiscountType = "fixed" | "percentage";
export interface ICoupon extends Document {
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount: number;
    maxUsage: number;
    usageCount: number;
    usedBy: mongoose.Types.ObjectId[];
    applicableProducts: mongoose.Types.ObjectId[];
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICategory extends Document {
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    parentId?: mongoose.Types.ObjectId | null;
    level: number;
    isActive: boolean;
    deleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
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
export {};
//# sourceMappingURL=model.interfaces.d.ts.map