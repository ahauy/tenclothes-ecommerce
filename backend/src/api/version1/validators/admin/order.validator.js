"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDeleteOrderSchema = exports.batchUpdateOrderStatusSchema = exports.updateOrderStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
            message: "Trạng thái đơn hàng không hợp lệ"
        }).optional(),
        paymentStatus: zod_1.z.enum(["unpaid", "paid", "refunded"], {
            message: "Trạng thái thanh toán không hợp lệ"
        }).optional(),
    }).refine(data => data.orderStatus !== undefined || data.paymentStatus !== undefined, {
        message: "Phải cung cấp ít nhất orderStatus hoặc paymentStatus",
        path: ["body"],
    }),
});
exports.batchUpdateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderIds: zod_1.z.array(zod_1.z.string({
            message: "ID đơn hàng là bắt buộc và phải là chuỗi"
        }).regex(/^[0-9a-fA-F]{24}$/, "ID đơn hàng không hợp lệ")).min(1, "Phải chọn ít nhất 1 đơn hàng"),
        orderStatus: zod_1.z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
            message: "Trạng thái đơn hàng không hợp lệ"
        }).optional(),
        paymentStatus: zod_1.z.enum(["unpaid", "paid", "refunded"], {
            message: "Trạng thái thanh toán không hợp lệ"
        }).optional(),
    }).refine(data => data.orderStatus !== undefined || data.paymentStatus !== undefined, {
        message: "Phải cung cấp ít nhất orderStatus hoặc paymentStatus",
        path: ["body"],
    }),
});
exports.batchDeleteOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderIds: zod_1.z.array(zod_1.z.string({
            message: "ID đơn hàng là bắt buộc và phải là chuỗi"
        }).regex(/^[0-9a-fA-F]{24}$/, "ID đơn hàng không hợp lệ")).min(1, "Phải chọn ít nhất 1 đơn hàng"),
    }),
});
//# sourceMappingURL=order.validator.js.map