export interface IVariants {
  sku?: string;
  color?: string; // Có thể có hoặc không
  size?: string;  // Có thể có hoặc không
  stock: number;  // Chắc chắn phải có số lượng tồn kho (dù là 0)
  imageUrl?: string;
}

export interface IProduct {
  _id: string; // Thêm _id của MongoDB (ép kiểu thành string ở Frontend)
  title: string; // Bắt buộc
  slug: string; // Bắt buộc
  description?: string; // Có thể để trống
  categoryIds?: string[];
  price: number; // Bắt buộc
  currency?: string; 
  discountPercentage?: number;
  salePrice?: number;
  variants: IVariants[]; // Mặc định trả về mảng (dù rỗng)
  media: string[]; // Bắt buộc phải có mảng ảnh
}