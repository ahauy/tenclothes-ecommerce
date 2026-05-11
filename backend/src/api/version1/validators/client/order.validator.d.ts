import { z } from "zod";
export declare const PAYMENT_METHOD: readonly ["cod", "momo"];
export declare const orderSchema: z.ZodObject<{
    body: z.ZodObject<{
        customer: z.ZodObject<{
            fullName: z.ZodString;
            email: z.ZodEmail;
            phone: z.ZodString;
            province: z.ZodString;
            district: z.ZodString;
            ward: z.ZodString;
            detailAddress: z.ZodString;
            note: z.ZodOptional<z.ZodString>;
            paymentMethod: z.ZodEnum<{
                cod: "cod";
                momo: "momo";
            }>;
        }, z.core.$strip>;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            sku: z.ZodString;
            color: z.ZodString;
            size: z.ZodString;
            quantity: z.ZodNumber;
        }, z.core.$strip>>;
        couponCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type IOrderReq = z.infer<typeof orderSchema>['body'];
//# sourceMappingURL=order.validator.d.ts.map