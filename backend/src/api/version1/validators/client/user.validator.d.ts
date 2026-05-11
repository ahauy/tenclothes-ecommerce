import { z } from "zod";
declare const updateProfileBodySchema: z.ZodObject<{
    fullName: z.ZodString;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>>;
    dob: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    height: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    weight: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        fullName: z.ZodString;
        phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        gender: z.ZodOptional<z.ZodEnum<{
            male: "male";
            female: "female";
            other: "other";
        }>>;
        dob: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        height: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        weight: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type IUpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
declare const changePasswordBodySchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type IChangePasswordBody = z.infer<typeof changePasswordBodySchema>;
declare const addressBodySchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    province: z.ZodString;
    district: z.ZodString;
    ward: z.ZodString;
    address: z.ZodString;
}, z.core.$strip>;
export declare const addressSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        province: z.ZodString;
        district: z.ZodString;
        ward: z.ZodString;
        address: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type IAddressBody = z.infer<typeof addressBodySchema>;
export {};
//# sourceMappingURL=user.validator.d.ts.map