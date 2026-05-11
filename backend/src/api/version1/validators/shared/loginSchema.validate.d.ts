import { z } from "zod";
declare const loginBodySchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ILoginReqBody = z.infer<typeof loginBodySchema>;
export {};
//# sourceMappingURL=loginSchema.validate.d.ts.map