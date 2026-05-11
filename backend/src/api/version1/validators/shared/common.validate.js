"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordComplexSchema = void 0;
const zod_1 = require("zod");
// check mật khẩu
exports.passwordComplexSchema = zod_1.z.string()
    .min(6, "Tối thiểu 6 ký tự")
    .regex(/[A-Z]/, "Cần 1 chữ hoa")
    .regex(/[0-9]/, "Cần 1 số")
    .regex(/[^A-Za-z0-9]/, "Cần 1 ký tự đặc biệt");
//# sourceMappingURL=common.validate.js.map