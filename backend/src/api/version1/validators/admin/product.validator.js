"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1, "Tên sản phẩm không được để trống!"),
        description: zod_1.z.string().default(""),
        brand: zod_1.z.string().optional(),
        weight: zod_1.z.coerce.number().min(0, "Trọng lượng không được âm").default(0),
        categoryIds: zod_1.z.preprocess((val) => {
            if (!val)
                return [];
            if (typeof val === "string")
                return [val];
            return val;
        }, zod_1.z.array(zod_1.z.string()).min(1, "Sản phẩm phải nằm trong 1 danh mục nào đó!")),
        tags: zod_1.z.preprocess((val) => {
            if (!val)
                return [];
            if (typeof val === "string")
                return val.split(",").map((t) => t.trim());
            return val;
        }, zod_1.z.array(zod_1.z.string()).default([])),
        price: zod_1.z.coerce.number().min(0, "Giá sản phẩm không được là số âm!"),
        currency: zod_1.z
            .enum(["$", "VND", "EUR"], "Tiền tệ không hợp lệ!")
            .default("VND"),
        discountPercentage: zod_1.z.coerce
            .number()
            .min(0, "Phần trăm giảm giá không được nhỏ hơn 0!")
            .max(100, "Phần trăm giảm giá không được lớn hơn 100!"),
        gender: zod_1.z.enum(["male", "female", "unisex"], "Giới tính chỉ được chọn male, female hoặc unisex!"),
        // VALIDATE STYLE SẢN PHẨM (MÀU SẮC & HÌNH ẢNH)
        productStyles: zod_1.z.preprocess((val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                }
                catch (e) {
                    return [];
                }
            }
            return val;
        }, zod_1.z
            .array(zod_1.z.object({
            colorName: zod_1.z.string().min(1, "Tên màu không được để trống!"),
            colorHex: zod_1.z.string().min(1, "Mã màu hex không được để trống!"),
            images: zod_1.z
                .array(zod_1.z.string().url("Link ảnh không hợp lệ!"))
                .min(1, "Mỗi màu sắc phải có ít nhất 1 ảnh!"),
            isDefault: zod_1.z.boolean().default(false),
        }))
            .min(1, "Sản phẩm phải có ít nhất 1 kiểu màu sắc!")),
        // VALIDATE BIẾN THỂ TỒN KHO (SIZE & KHO)
        variants: zod_1.z.preprocess((val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                }
                catch (e) {
                    return [];
                }
            }
            return val;
        }, zod_1.z
            .array(zod_1.z.object({
            sku: zod_1.z.string().min(1, "Mã SKU không được để trống!"),
            colorName: zod_1.z
                .string()
                .min(1, "Tên màu của biến thể không được để trống!"),
            size: zod_1.z.string().min(1, { error: "Size không được để trống!" }),
            stock: zod_1.z.coerce
                .number()
                .min(0, { error: "Tồn kho không được âm!" }),
            priceDifference: zod_1.z.coerce.number().default(0),
        }))
            .min(1, "Sản phẩm phải có ít nhất 1 phân loại hàng!")),
        isActive: zod_1.z.preprocess((val) => val === "true" || val === true, zod_1.z.boolean()),
        isFeatured: zod_1.z.preprocess((val) => val === "true" || val === true, zod_1.z.boolean()),
    })
        .strict(),
});
//# sourceMappingURL=product.validator.js.map