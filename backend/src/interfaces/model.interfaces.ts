import mongoose, { Document } from "mongoose";

// -------------------- USER MODEL ------------------
interface IAddresses {
  name: string; // Tên người nhận hàng
  phone: string; // Điện thoại người nhận hàng
  province: string; // Tỉnh/thành phố
  district: string; // Quận/huyện
  ward: string; // Phường xã
  address: string; // Số nhà, đường ....
  isDefault: boolean;
}

interface IInfo {
  height?: string;
  weight?: string;
  dob?: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string; // có thể để là optional nếu đăng nhập bằng fb hoặc gg nhưng trong dự án này chỉ cho đăng nhập bằng email và phải có mật khẩu
  deleted: boolean;
  phone?: string;
  info?: IInfo;
  addresses?: IAddresses[];
  isActive: boolean; // Trạng thái tài khoản của khách hàng
  deletedAt?: Date;
  createdAt?: Date; // auto nhờ có timestamps: true
  updatedAt?: Date; // auto nhờ có timestamps: true
}

// ----------------- ACCOUNT MODEL -----------------
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

// ---------------- PRODUCT MODEL ------------------
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
  categoryId: mongoose.Types.ObjectId;
  brand?: string;
  tags: string[];

  price: number;
  currency: string;
  discountPercentage: number;
  salePrice: number; // Virtual field

  gender: "male" | "female" | "unisex";

  productStyles: IProductStyle[];
  variants: IProductVariant[];

  totalStock: number;
  sold: number;

  averageRating: number;
  reviewCount: number;

  weight: number; // Tính bằng gram để tính phí ship

  isActive: boolean;
  isFeatured: boolean;
  deleted: boolean;
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// --------------- ORDER & CART ITEMS ----------------
export interface IOrderProductItem {
  productId: mongoose.Types.ObjectId;
  sku: string; // Thêm mã kho để quản lý thực tế
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  color: string; // Thêm màu sắc
  size: string;
  image: string;
  quantity: number;
  isOutOfStock?: boolean;
  isReviewed?: boolean;
}

// ----------------- CART MODEL -------------
export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  sku?: string; // Có thể optional vì khi thêm vào giỏ có thể chưa truyền ngay
  color: string; // Bắt buộc phải có để phân biệt biến thể
  size: string;
  quantity: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  items: ICartItem[];
}

// --------------- ORDER MODEL --------------------
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

  // Các trường Backend tự sinh ra để quản lý
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// ----------------- CATEGORY MODEL ------------------
export interface ICategory extends Document {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;

  parentId?: mongoose.Types.ObjectId | null; // Trỏ đến ID của danh mục cha

  level: number;

  isActive: boolean;
  deleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
