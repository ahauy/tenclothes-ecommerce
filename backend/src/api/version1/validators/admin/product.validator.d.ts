import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodDefault<z.ZodString>;
        brand: z.ZodOptional<z.ZodString>;
        weight: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        categoryIds: z.ZodPipe<z.ZodTransform<string[], unknown>, z.ZodArray<z.ZodString>>;
        tags: z.ZodPipe<z.ZodTransform<string[], unknown>, z.ZodDefault<z.ZodArray<z.ZodString>>>;
        price: z.ZodCoercedNumber<unknown>;
        currency: z.ZodDefault<z.ZodEnum<{
            $: "$";
            VND: "VND";
            EUR: "EUR";
        }>>;
        discountPercentage: z.ZodCoercedNumber<unknown>;
        gender: z.ZodEnum<{
            male: "male";
            female: "female";
            unisex: "unisex";
        }>;
        productStyles: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodObject<{
            colorName: z.ZodString;
            colorHex: z.ZodString;
            images: z.ZodArray<z.ZodString>;
            isDefault: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
        variants: z.ZodPipe<z.ZodTransform<any, unknown>, z.ZodArray<z.ZodObject<{
            sku: z.ZodString;
            colorName: z.ZodString;
            size: z.ZodString;
            stock: z.ZodCoercedNumber<unknown>;
            priceDifference: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>>;
        isActive: z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>;
        isFeatured: z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type ICreateProductReqBody = z.infer<typeof createProductSchema>["body"];
//# sourceMappingURL=product.validator.d.ts.map