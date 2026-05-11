"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const common_validate_1 = require("../shared/common.validate");
// ---- Update Profile Schema ----
const updateProfileBodySchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Vui lòng nhập họ tên!").max(100, "Họ tên không được quá 100 ký tự!"),
    phone: zod_1.z
        .string()
        .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ!")
        .optional()
        .or(zod_1.z.literal("")),
    gender: zod_1.z.enum(["male", "female", "other"]).optional(),
    dob: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ!")
        .optional()
        .or(zod_1.z.literal("")),
    height: zod_1.z
        .string()
        .regex(/^\d+$/, "Chiều cao phải là số!")
        .optional()
        .or(zod_1.z.literal("")),
    weight: zod_1.z
        .string()
        .regex(/^\d+$/, "Cân nặng phải là số!")
        .optional()
        .or(zod_1.z.literal("")),
});
exports.updateProfileSchema = zod_1.z.object({
    body: updateProfileBodySchema,
});
// ---- Change Password Schema ----
const changePasswordBodySchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Vui lòng nhập mật khẩu hiện tại!"),
    newPassword: common_validate_1.passwordComplexSchema,
    confirmPassword: zod_1.z.string().min(1, "Vui lòng xác nhận mật khẩu mới!"),
});
exports.changePasswordSchema = zod_1.z
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
// ---- Address Schema ----
const addressBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Vui lòng nhập tên người nhận!").max(100),
    phone: zod_1.z
        .string()
        .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ!"),
    province: zod_1.z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố!"),
    district: zod_1.z.string().min(1, "Vui lòng chọn Quận/Huyện!"),
    ward: zod_1.z.string().min(1, "Vui lòng chọn Phường/Xã!"),
    address: zod_1.z.string().min(1, "Vui lòng nhập địa chỉ chi tiết!").max(200),
});
exports.addressSchema = zod_1.z.object({
    body: addressBodySchema,
});
//# sourceMappingURL=user.validator.js.map