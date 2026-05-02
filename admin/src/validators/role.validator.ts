import { z } from "zod";

export const roleSchema = z.object({
  title: z.string().min(2, "Tên vai trò phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

export type RoleFormData = z.infer<typeof roleSchema>;
