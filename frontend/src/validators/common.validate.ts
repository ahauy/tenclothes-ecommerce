import { z } from "zod" 

export const passwordComplexSchema = z
  .string()
  .min(6, "Mật khẩu phải có tối thiểu 6 ký tự!")
  .regex(/[A-Z]/, "Mật khẩu cần ít nhất 1 chữ cái hoa!")
  .regex(/[0-9]/, "Mật khẩu cần ít nhất 1 số!")
  .regex(/[^A-Za-z0-9]/, "Mật khẩu cần ít nhất 1 ký tự đặc biệt!");