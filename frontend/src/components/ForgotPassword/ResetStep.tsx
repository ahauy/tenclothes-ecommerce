import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { authServices } from "../../services/authService";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValue,
} from "../../validators/signUp.validate";
import type { IJsonFail } from "../../interfaces/iAuthState";

interface ResetStepProps {
  email: string;
  otp: string;
}

export const ResetStep = ({ email, otp }: ResetStepProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValue> = async (data) => {
    try {
      const res = await authServices.resetPasswordService(
        email,
        otp,
        data.password,
        data.confirmPassword
      );
      if (res.data.status) {
        toast.success(res.data.message || "Đặt lại mật khẩu thành công!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Đặt lại mật khẩu thất bại!");
      }
    } catch (error) {
      if (axios.isAxiosError<IJsonFail>(error) && error.response?.data) {
        toast.error(error.response.data.message || "Đặt lại mật khẩu thất bại!");
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
        <p className="prata-regular text-3xl">Reset Password</p>
        <hr className="border-none w-8 bg-gray-800 h-[1.5px]" />
      </div>
      <p className="text-gray-500 text-sm text-center -mt-2 mb-2">
        Nhập mật khẩu mới của bạn bên dưới. Mật khẩu phải có độ phức tạp cao.
      </p>

      <div className="w-full">
        <input
          {...register("password")}
          type="password"
          className={`w-full px-3 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="New password"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="w-full">
        <input
          {...register("confirmPassword")}
          type="password"
          className={`w-full px-3 py-2 border ${
            errors.confirmPassword ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="Confirm new password"
          required
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full border-none bg-black ${
          isSubmitting ? "opacity-60" : "opacity-100"
        } text-white py-3 cursor-pointer hover:bg-gray-800 transition-colors`}
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};
