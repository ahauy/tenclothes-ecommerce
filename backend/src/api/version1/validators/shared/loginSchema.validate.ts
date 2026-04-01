import { z } from "zod";
import { passwordComplexSchema } from "./common.validate";


const loginBodySchema = z.object({
  email: z.email("Sai định dạng email").min(1, "Email không được để trống!"),
  password: passwordComplexSchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
});

export type ILoginReqBody = z.infer<typeof loginBodySchema>;
