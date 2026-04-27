import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createReviewSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .min(1, "Vui lòng cung cấp productId!")
      .regex(objectIdRegex, "Định dạng productId không hợp lệ!"),
    orderId: z
      .string()
      .min(1, "Vui lòng cung cấp orderId!")
      .regex(objectIdRegex, "Định dạng orderId không hợp lệ!"),
    rating: z.coerce
      .number()
      .min(1, "Đánh giá tối thiểu là 1 sao!")
      .max(5, "Đánh giá tối đa là 5 sao!"),
    content: z
      .string()
      .min(5, "Nội dung đánh giá quá ngắn (ít nhất 5 ký tự)")
      .max(1000, "Nội dung đánh giá không được vượt quá 1000 ký tự"),

    images: z
      .array(z.url("Định dạng link ảnh không hợp lệ"))
      .optional(),
  }),
});

export type CreateReviewReqBody = z.infer<typeof createReviewSchema>["body"];