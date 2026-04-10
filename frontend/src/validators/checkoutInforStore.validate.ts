import { z } from "zod"

// Biểu thức chính quy cho số điện thoại VN
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export const checkoutInfoSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên!"),
  email: z.email("Email không hợp lệ!"),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố!"),
  district: z.string().min(1, "Vui lòng chọn Quận/Huyện!"),
  ward: z.string().min(1, "Vui lòng chọn Phường/Xã!"),
  detailAddress: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết!"),
  note: z.string().optional(),
  paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán!")
})

export type CheckoutInfoValue = z.infer<typeof checkoutInfoSchema>