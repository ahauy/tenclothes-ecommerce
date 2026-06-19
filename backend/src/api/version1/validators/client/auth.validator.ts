import { z } from "zod";
import { passwordComplexSchema } from "../shared/common.validate";

const registerBodySchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên!"),
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


export type IRegisterReqBody = z.infer<typeof registerBodySchema>;

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Sai định dạng email!")
      .min(1, "Email không được để trống!"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Sai định dạng email!")
      .min(1, "Email không được để trống!"),
    otp: z.string().min(1, "Vui lòng nhập mã OTP!"),
  }),
});

const resetPasswordBodySchema = z.object({
  email: z
    .string()
    .email("Sai định dạng email!")
    .min(1, "Email không được để trống!"),
  otp: z.string().min(1, "Vui lòng nhập mã OTP!"),
  password: passwordComplexSchema,
  confirmPassword: passwordComplexSchema,
});

export const resetPasswordSchema = z
  .object({
    body: resetPasswordBodySchema,
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

export type IForgotPasswordReqBody = z.infer<typeof forgotPasswordSchema>["body"];
export type IVerifyOtpReqBody = z.infer<typeof verifyOtpSchema>["body"];
export type IResetPasswordReqBody = z.infer<typeof resetPasswordBodySchema>;