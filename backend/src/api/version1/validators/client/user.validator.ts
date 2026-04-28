import { z } from "zod";
import { passwordComplexSchema } from "../shared/common.validate";

// ---- Update Profile Schema ----
const updateProfileBodySchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên!").max(100, "Họ tên không được quá 100 ký tự!"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ!")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ!")
    .optional()
    .or(z.literal("")),
  height: z
    .string()
    .regex(/^\d+$/, "Chiều cao phải là số!")
    .optional()
    .or(z.literal("")),
  weight: z
    .string()
    .regex(/^\d+$/, "Cân nặng phải là số!")
    .optional()
    .or(z.literal("")),
});

export const updateProfileSchema = z.object({
  body: updateProfileBodySchema,
});

export type IUpdateProfileBody = z.infer<typeof updateProfileBodySchema>;

// ---- Change Password Schema ----
const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại!"),
  newPassword: passwordComplexSchema,
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới!"),
});

export const changePasswordSchema = z
  .object({
    body: changePasswordBodySchema,
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp!",
    path: ["body", "confirmPassword"],
  })
  .refine((data) => data.body.currentPassword !== data.body.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại!",
    path: ["body", "newPassword"],
  });

export type IChangePasswordBody = z.infer<typeof changePasswordBodySchema>;

// ---- Address Schema ----
const addressBodySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên người nhận!").max(100),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ!"),
  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố!"),
  district: z.string().min(1, "Vui lòng chọn Quận/Huyện!"),
  ward: z.string().min(1, "Vui lòng chọn Phường/Xã!"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết!").max(200),
});

export const addressSchema = z.object({
  body: addressBodySchema,
});

export type IAddressBody = z.infer<typeof addressBodySchema>;
