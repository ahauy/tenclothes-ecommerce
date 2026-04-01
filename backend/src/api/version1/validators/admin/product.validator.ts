import { z } from "zod";

export const createProductSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, "Tên sản phẩm không được để trống!"),
      description: z.string().default(""),
      categoryIds: z.preprocess((val: string): string[] => {
        if (!val) return [];
        if (typeof val === "string") return [val];
        return val;
      }, z.array(z.string()).min(1, "Sản phẩm phải nằm trong 1 danh mục nào đó!")),
      price: z.coerce.number().min(0, "Giá sản phẩm không được là số âm!"),
      currency: z.enum(["$", "VND", "EUR"], "Tiền tệ không hợp lệ!"),
      discountPercentage: z.coerce
        .number()
        .min(0, "Phần trăm giảm giá không được nhỏ hơn 0!")
        .max(100, "Phần trăm giảm giá không được lớn hơn 100!"),
      gender: z.enum(
        ["male", "female", "unisex"],
        "Giới tính chỉ được chọn male, female hoặc unisex!"
      ),
      variants: z.preprocess(
        (val) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val); // Giải nén cục chuỗi Frontend gửi lên về lại thành Mảng Object
            } catch (e) {
              return [];
            }
          }
          return val;
        },
        // Bắt đầu soi cấu trúc bên trong sau khi đã giải nén
        z.array(
          z.object({
            // sku: z.string(),
            color: z.string().default(""),
            size: z.string().min(1, { error: "Size không được để trống!" }),
            stock: z.coerce
              .number()
              .min(0, { error: "Tồn kho không được âm!" }),
          })
        )
      ),
      media: z.array(z.url("Đường dẫn ảnh biến thể phải là một URL hợp lệ!")).default([]),
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
