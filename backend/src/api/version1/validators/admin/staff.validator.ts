import { z } from "zod";

export const createStaffSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(["admin", "employee"]).default("employee"),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Họ và tên không được để trống").optional(),
    email: z.string().email("Email không hợp lệ").optional(),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên").optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(["admin", "employee"]).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getStaffsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    keyword: z.string().optional(),
  }),
});
