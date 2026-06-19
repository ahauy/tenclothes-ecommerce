import { z } from "zod";

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    status: z.enum(["active", "inactive", "all"]).optional().default("all"),
    search: z.string().optional(),
    sort: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean({
      message: "Trạng thái phải là kiểu boolean",
    }),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").optional(),
    phone: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    info: z
      .object({
        height: z.string().optional(),
        weight: z.string().optional(),
        dob: z.string().optional(),
      })
      .optional(),
  }),
});
