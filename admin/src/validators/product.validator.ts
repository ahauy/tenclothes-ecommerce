import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Tên sản phẩm không được để trống!"),
  description: z.string().min(1, "Mô tả không được để trống!"),
  brand: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 danh mục"),
  gender: z.enum(["male", "female", "unisex"]),
  weight: z.number().min(0),
  price: z.number().min(0, "Giá không được âm"),
  discountPercentage: z.number().min(0).max(100),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  
  productStyles: z.array(z.object({
    colorName: z.string().min(1, "Tên màu không được để trống"),
    colorHex: z.string().min(1, "Mã màu không được để trống"),
    images: z.array(z.string()).optional(),
    isDefault: z.boolean()
  })).min(1, "Cần ít nhất 1 style màu sắc"),

  variants: z.array(z.object({
    sku: z.string().min(1, "SKU không được để trống"),
    colorName: z.string().min(1, "Vui lòng chọn màu"),
    size: z.string().min(1, "Vui lòng chọn size"),
    stock: z.number().min(0, "Tồn kho không được âm"),
    priceDifference: z.number()
  })).min(1, "Cần ít nhất 1 phân loại hàng")
});

export type ProductFormData = z.infer<typeof productSchema>;
