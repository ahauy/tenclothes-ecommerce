import { NavLink } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { authServices } from "../../services/authService";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValue,
} from "../../validators/signUp.validate";
import type { IJsonFail } from "../../interfaces/iAuthState";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export const EmailStep = ({ email, setEmail, setStep }: EmailStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValue> = async (data) => {
    try {
      const res = await authServices.forgotPasswordService(data.email);
      if (res.data.status) {
        setEmail(data.email);
        toast.success(res.data.message || "Mã OTP đã được gửi!");
        setStep(2);
      } else {
        toast.error(res.data.message || "Gửi OTP thất bại!");
      }
    } catch (error) {
      if (axios.isAxiosError<IJsonFail>(error) && error.response?.data) {
        toast.error(error.response.data.message || "Gửi OTP thất bại!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 animate-fade-in-up"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Forgot Password</p>
        <hr className="border-none w-8 bg-gray-800 h-[1.5px]" />
      </div>
      <p className="text-gray-500 text-sm text-center -mt-2 mb-2">
        Nhập email của bạn để nhận mã xác thực OTP đặt lại mật khẩu.
      </p>

      <div className="w-full">
        <input
          {...register("email")}
          type="email"
          className={`w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="w-full flex justify-end text-sm -mt-2">
        <NavLink to="/login" className="hover:underline">
          Back to Login
        </NavLink>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full border-none bg-black ${
          isSubmitting ? "opacity-60" : "opacity-100"
        } text-white py-3 cursor-pointer hover:bg-gray-800 transition-colors`}
      >
        {isSubmitting ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};
