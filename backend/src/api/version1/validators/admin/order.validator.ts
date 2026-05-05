import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
      message: "Trạng thái đơn hàng không hợp lệ"
    }).optional(),
    paymentStatus: z.enum(["unpaid", "paid", "refunded"], {
      message: "Trạng thái thanh toán không hợp lệ"
    }).optional(),
  }).refine(data => data.orderStatus !== undefined || data.paymentStatus !== undefined, {
    message: "Phải cung cấp ít nhất orderStatus hoặc paymentStatus",
    path: ["body"],
  }),
});

export const batchUpdateOrderStatusSchema = z.object({
  body: z.object({
    orderIds: z.array(
      z.string({
        message: "ID đơn hàng là bắt buộc và phải là chuỗi"
      }).regex(/^[0-9a-fA-F]{24}$/, "ID đơn hàng không hợp lệ")
    ).min(1, "Phải chọn ít nhất 1 đơn hàng"),
    orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
      message: "Trạng thái đơn hàng không hợp lệ"
    }).optional(),
    paymentStatus: z.enum(["unpaid", "paid", "refunded"], {
      message: "Trạng thái thanh toán không hợp lệ"
    }).optional(),
  }).refine(data => data.orderStatus !== undefined || data.paymentStatus !== undefined, {
    message: "Phải cung cấp ít nhất orderStatus hoặc paymentStatus",
    path: ["body"],
  }),
});

export const batchDeleteOrderSchema = z.object({
  body: z.object({
    orderIds: z.array(
      z.string({
        message: "ID đơn hàng là bắt buộc và phải là chuỗi"
      }).regex(/^[0-9a-fA-F]{24}$/, "ID đơn hàng không hợp lệ")
    ).min(1, "Phải chọn ít nhất 1 đơn hàng"),
  }),
});
