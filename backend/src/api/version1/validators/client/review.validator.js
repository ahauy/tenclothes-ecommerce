"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z
            .string()
            .min(1, "Vui lòng cung cấp productId!")
            .regex(objectIdRegex, "Định dạng productId không hợp lệ!"),
        orderId: zod_1.z
            .string()
            .min(1, "Vui lòng cung cấp orderId!")
            .regex(objectIdRegex, "Định dạng orderId không hợp lệ!"),
        rating: zod_1.z.coerce
            .number()
            .min(1, "Đánh giá tối thiểu là 1 sao!")
            .max(5, "Đánh giá tối đa là 5 sao!"),
        content: zod_1.z
            .string()
            .min(5, "Nội dung đánh giá quá ngắn (ít nhất 5 ký tự)")
            .max(1000, "Nội dung đánh giá không được vượt quá 1000 ký tự"),
        images: zod_1.z
            .array(zod_1.z.url("Định dạng link ảnh không hợp lệ"))
            .optional(),
    }),
});
//# sourceMappingURL=review.validator.js.map