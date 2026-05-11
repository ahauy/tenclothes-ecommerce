"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = exports.PAYMENT_METHOD = void 0;
const zod_1 = require("zod");
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.PAYMENT_METHOD = ["cod", "momo"];
exports.orderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customer: zod_1.z.object({
            fullName: zod_1.z.string().min(1, "Vui lòng nhập họ tên!"),
            email: zod_1.z.email("Email không hợp lệ!"),
            phone: zod_1.z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
            province: zod_1.z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố!"),
            district: zod_1.z.string().min(1, "Vui lòng chọn Quận/Huyện!"),
            ward: zod_1.z.string().min(1, "Vui lòng chọn Phường/Xã!"),
            detailAddress: zod_1.z.string().min(1, "Vui lòng nhập địa chỉ chi tiết!"),
            note: zod_1.z.string().optional(),
            paymentMethod: zod_1.z.enum(exports.PAYMENT_METHOD, "Vui lòng chọn một phương thức thanh toán!")
        }),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().min(1, "Thiếu ID sản phẩm").regex(objectIdRegex, "ID sản phẩm không hợp lệ!"),
            sku: zod_1.z.string().min(1, "Thiếu mã SKU của sản phẩm"),
            color: zod_1.z.string().min(1, "Vui lòng chọn màu sắc!"),
            size: zod_1.z.string().min(1, "Vui lòng chọn size sản phẩm!"),
            quantity: zod_1.z.number().int("Số lượng phải là số nguyên!").min(1, "Phải có ít nhất 1 sản phẩm!")
        })).min(1, "Giỏ hàng trống, không thể tiến hành đặt hàng!"),
        couponCode: zod_1.z.string().optional().nullable(),
    }),
});
//# sourceMappingURL=order.validator.js.map