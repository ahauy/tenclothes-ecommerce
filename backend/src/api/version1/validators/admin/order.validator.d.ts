import { z } from "zod";
export declare const updateOrderStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        orderStatus: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            processing: "processing";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
        }>>;
        paymentStatus: z.ZodOptional<z.ZodEnum<{
            unpaid: "unpaid";
            paid: "paid";
            refunded: "refunded";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const batchUpdateOrderStatusSchema: z.ZodObject<{
    body: z.ZodObject<{
        orderIds: z.ZodArray<z.ZodString>;
        orderStatus: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            processing: "processing";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
        }>>;
        paymentStatus: z.ZodOptional<z.ZodEnum<{
            unpaid: "unpaid";
            paid: "paid";
            refunded: "refunded";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const batchDeleteOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        orderIds: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=order.validator.d.ts.map