import { z } from "zod";
import { passwordComplexSchema } from "../shared/common.validate";

const registerBodySchema = z.object({
  fullName: z.string().min(0, "Vui lòng nhập họ tên!"),
  email: z.email("Sai định dạng email").min(1, "Email không được để trống!"),
  password: passwordComplexSchema,
  confirmPassword: passwordComplexSchema,
});


export const registerSchema = z
  .object({
    body: registerBodySchema,
  })
  .refine(
    (data) => {
      return data.body.password === data.body.confirmPassword;
    },
    {
      message: "Mật khẩu xác nhận không trùng khớp!",
      path: ["body", "confirmPassword"],
    }
  );


export type IRegisterReqBody = z.infer<typeof registerBodySchema>