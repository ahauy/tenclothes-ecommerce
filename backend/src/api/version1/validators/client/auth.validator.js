"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const common_validate_1 = require("../shared/common.validate");
const registerBodySchema = zod_1.z.object({
    fullName: zod_1.z.string().min(0, "Vui lòng nhập họ tên!"),
    email: zod_1.z.email("Sai định dạng email").min(1, "Email không được để trống!"),
    password: common_validate_1.passwordComplexSchema,
    confirmPassword: common_validate_1.passwordComplexSchema,
});
exports.registerSchema = zod_1.z
    .object({
    body: registerBodySchema,
})
    .refine((data) => {
    return data.body.password === data.body.confirmPassword;
}, {
    message: "Mật khẩu xác nhận không trùng khớp!",
    path: ["body", "confirmPassword"],
});
//# sourceMappingURL=auth.validator.js.map