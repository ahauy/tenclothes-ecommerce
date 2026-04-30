import { z } from "zod";

export const passwordComplexSchema = z.string()
  .min(6, "Tối thiểu 6 ký tự")
  .regex(/[A-Z]/, "Cần 1 chữ hoa")
  .regex(/[0-9]/, "Cần 1 số")
  .regex(/[^A-Za-z0-9]/, "Cần 1 ký tự đặc biệt");

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: passwordComplexSchema,
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
