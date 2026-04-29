import mongoose, { Document } from "mongoose";

// -------------------- USER MODEL ------------------
export interface IAddresses extends mongoose.Types.Subdocument {
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
  dob?: string;
}

type IGender = "male" | "female" | "other";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string; // có thể để là optional nếu đăng nhập bằng fb hoặc gg nhưng trong dự án này chỉ cho đăng nhập bằng email và phải có mật khẩu
  deleted: boolean;
  phone?: string;
  gender?: IGender;
  info?: IInfo;
  addresses?: mongoose.Types.DocumentArray<IAddresses>;
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
  totalAmount: number;      // Tổng giá trước giảm
  discountAmount?: number;  // Số tiền được giảm bởi coupon
  finalAmount?: number;     // Số tiền thực tế phải trả = totalAmount - discountAmount
  couponCode?: string;      // Mã coupon đã dùng

  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// --------------- COUPON MODEL --------------------
export type DiscountType = "fixed" | "percentage";

export interface ICoupon extends Document {
  code: string;                         // Mã giảm giá (UPPERCASE, unique)
  description: string;                  // Mô tả mã giảm giá (VD: Giảm 50k cho đơn từ 200k)
  discountType: DiscountType;           // Loại giảm: fixed (tiền) | percentage (%)
  discountValue: number;                // Giá trị: 50000 (fixed) hoặc 20 (%)
  maxDiscountAmount?: number;           // Giới hạn tối đa khi type=percentage
  minOrderAmount: number;               // Đơn tối thiểu để áp dụng
  maxUsage: number;                     // Tổng số lần dùng tối đa
  usageCount: number;                   // Đã dùng bao nhiêu lần (atomic)
  usedBy: mongoose.Types.ObjectId[];    // Danh sách userId đã dùng
  applicableProducts: mongoose.Types.ObjectId[]; // Rỗng = áp dụng tất cả
  expiresAt: Date;                      // Ngày hết hạn
  isActive: boolean;
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
