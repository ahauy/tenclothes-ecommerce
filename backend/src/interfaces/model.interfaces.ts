import { Document } from "mongoose";

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
interface IVariants {
  sku?: string;
  color?: string;
  size: string;
  stock: number;
  imageUrl?: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description?: string;
  categoryIds: string[];
  price: number;
  currency: string;
  discountPercentage?: number;
  salePrice?: number;
  gender: string;
  variants: IVariants[];
  media: string[];
  isActive: boolean;
  isFeatured: boolean;
  deleted: boolean;
  updatedAt?: Date;
  createdAt?: Date; 
}
