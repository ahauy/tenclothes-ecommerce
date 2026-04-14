import { z } from "zod";

export const createProductSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, "Tên sản phẩm không được để trống!"),
      description: z.string().default(""),
      brand: z.string().optional(),
      weight: z.coerce.number().min(0, "Trọng lượng không được âm").default(0),

      categoryIds: z.preprocess((val: unknown): string[] => {
        if (!val) return [];
        if (typeof val === "string") return [val];
        return val as string[];
      }, z.array(z.string()).min(1, "Sản phẩm phải nằm trong 1 danh mục nào đó!")),

      tags: z.preprocess((val: unknown): string[] => {
        if (!val) return [];
        if (typeof val === "string") return val.split(",").map((t) => t.trim());
        return val as string[];
      }, z.array(z.string()).default([])),

      price: z.coerce.number().min(0, "Giá sản phẩm không được là số âm!"),
      currency: z
        .enum(["$", "VND", "EUR"], "Tiền tệ không hợp lệ!")
        .default("VND"),
      discountPercentage: z.coerce
        .number()
        .min(0, "Phần trăm giảm giá không được nhỏ hơn 0!")
        .max(100, "Phần trăm giảm giá không được lớn hơn 100!"),
      gender: z.enum(["male", "female", "unisex"], "Giới tính chỉ được chọn male, female hoặc unisex!"),

      // VALIDATE STYLE SẢN PHẨM (MÀU SẮC & HÌNH ẢNH)
      productStyles: z.preprocess(
        (val) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch (e) {
              return [];
            }
          }
          return val;
        },
        z
          .array(
            z.object({
              colorName: z.string().min(1, "Tên màu không được để trống!"),
              colorHex: z.string().min(1, "Mã màu hex không được để trống!"),
              images: z
                .array(z.string().url("Link ảnh không hợp lệ!"))
                .min(1, "Mỗi màu sắc phải có ít nhất 1 ảnh!"),
              isDefault: z.boolean().default(false),
            })
          )
          .min(1, "Sản phẩm phải có ít nhất 1 kiểu màu sắc!")
      ),

      // VALIDATE BIẾN THỂ TỒN KHO (SIZE & KHO)
      variants: z.preprocess(
        (val) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch (e) {
              return [];
            }
          }
          return val;
        },
        z
          .array(
            z.object({
              sku: z.string().min(1, "Mã SKU không được để trống!"),
              colorName: z
                .string()
                .min(1, "Tên màu của biến thể không được để trống!"),
              size: z.string().min(1, { error: "Size không được để trống!" }),
              stock: z.coerce
                .number()
                .min(0, { error: "Tồn kho không được âm!" }),
              priceDifference: z.coerce.number().default(0),
            })
          )
          .min(1, "Sản phẩm phải có ít nhất 1 phân loại hàng!")
      ),

      isActive: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean()
      ),
      isFeatured: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean()
      ),
    })
    .strict(),
});

export type ICreateProductReqBody = z.infer<typeof createProductSchema>["body"];
