import { z } from "zod";
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodString;
        orderId: z.ZodString;
        rating: z.ZodCoercedNumber<unknown>;
        content: z.ZodString;
        images: z.ZodOptional<z.ZodArray<z.ZodURL>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateReviewReqBody = z.infer<typeof createReviewSchema>["body"];
//# sourceMappingURL=review.validator.d.ts.map