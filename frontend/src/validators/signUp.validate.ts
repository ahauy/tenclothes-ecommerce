import { z } from "zod";
import { passwordComplexSchema } from "./common.validate";

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập họ tên!"),
    email: z.email("Email không hợp lệ!"),
    password: passwordComplexSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp!",
    path: ["confirmPassword"],
  });

export type SignUpFormValue = z.infer<typeof signUpSchema>;

// =============================================================
export const loginSchema = z.object({
  email: z.email("Email không hợp lệ!"),
  password: passwordComplexSchema,
});

export type loginFormValue = z.infer<typeof loginSchema>;

// =============================================================
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ!").min(1, "Email không được để trống!"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().min(1, "Vui lòng nhập mã OTP!"),
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordComplexSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp!",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValue = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpFormValue = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordFormValue = z.infer<typeof resetPasswordFormSchema>;