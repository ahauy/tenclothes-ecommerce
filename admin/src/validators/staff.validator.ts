import { z } from "zod";

export const staffSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  role: z.enum(["admin", "employee"]),
  isActive: z.boolean().default(true),
  avatar: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
