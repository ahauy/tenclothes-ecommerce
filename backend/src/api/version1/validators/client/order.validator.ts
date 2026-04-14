import { z } from "zod";

const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const PAYMENT_METHOD = ["cod", "momo"] as const

export const orderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().min(1, "Vui lòng nhập họ tên!"),
      email: z.email("Email không hợp lệ!"),
      phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
      province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố!"),
      district: z.string().min(1, "Vui lòng chọn Quận/Huyện!"),
      ward: z.string().min(1, "Vui lòng chọn Phường/Xã!"),
      detailAddress: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết!"),
      note: z.string().optional(),
      paymentMethod: z.enum(PAYMENT_METHOD, "Vui lòng chọn một phương thức thanh toán!")
    }),
    items: z.array(
      z.object({
        productId: z.string().min(1, "Thiếu ID sản phẩm").regex(objectIdRegex, "ID sản phẩm không hợp lệ!"),
        sku: z.string().min(1, "Thiếu mã SKU của sản phẩm"),
        color: z.string().min(1, "Vui lòng chọn màu sắc!"),
        size: z.string().min(1, "Vui lòng chọn size sản phẩm!"),
        quantity: z.number().int("Số lượng phải là số nguyên!").min(1, "Phải có ít nhất 1 sản phẩm!")
      })
    ).min(1, "Giỏ hàng trống, không thể tiến hành đặt hàng!")
  }),
});

export type IOrderReq = z.infer<typeof orderSchema>['body']