"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const common_validate_1 = require("./common.validate");
const loginBodySchema = zod_1.z.object({
    email: zod_1.z.email("Sai định dạng email").min(1, "Email không được để trống!"),
    password: common_validate_1.passwordComplexSchema,
});
exports.loginSchema = zod_1.z.object({
    body: loginBodySchema,
});
//# sourceMappingURL=loginSchema.validate.js.map