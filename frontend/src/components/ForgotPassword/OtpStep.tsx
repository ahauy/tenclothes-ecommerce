import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { authServices } from "../../services/authService";
import {
  verifyOtpSchema,
  type VerifyOtpFormValue,
} from "../../validators/signUp.validate";
import type { IJsonFail } from "../../interfaces/iAuthState";

interface OtpStepProps {
  email: string;
  setOtp: (otp: string) => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export const OtpStep = ({ email, setOtp, setStep }: OtpStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValue>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit: SubmitHandler<VerifyOtpFormValue> = async (data) => {
    try {
      const res = await authServices.verifyOtpService(email, data.otp);
      if (res.data.status) {
        setOtp(data.otp);
        toast.success(res.data.message || "Xác thực OTP thành công!");
        setStep(3);
      } else {
        toast.error(res.data.message || "Xác thực OTP thất bại!");
      }
    } catch (error) {
      if (axios.isAxiosError<IJsonFail>(error) && error.response?.data) {
        toast.error(error.response.data.message || "Mã OTP không hợp lệ hoặc đã hết hạn!");
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
        <p className="prata-regular text-3xl">Verify OTP</p>
        <hr className="border-none w-8 bg-gray-800 h-[1.5px]" />
      </div>
      <p className="text-gray-500 text-sm text-center -mt-2 mb-2">
        Mã xác thực đã được gửi tới email <br />
        <strong className="text-gray-700">{email}</strong>. Vui lòng nhập mã OTP để tiếp tục.
      </p>

      <div className="w-full">
        <input
          {...register("otp")}
          type="text"
          className={`w-full px-3 py-2 border text-center tracking-[0.25em] font-semibold text-lg ${
            errors.otp ? "border-red-500" : "border-gray-800"
          }`}
          placeholder="OTP Code"
          maxLength={6}
          required
        />
        {errors.otp && (
          <p className="text-red-500 text-xs mt-1 text-center">{errors.otp.message}</p>
        )}
      </div>

      <div className="w-full flex justify-between text-sm -mt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="hover:underline cursor-pointer border-none bg-transparent text-gray-800"
        >
          Back
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const res = await authServices.forgotPasswordService(email);
              if (res.data.status) {
                toast.success("Mã OTP mới đã được gửi lại!");
              }
            } catch (error) {
              toast.error("Gửi lại OTP thất bại!");
            }
          }}
          className="hover:underline cursor-pointer border-none bg-transparent text-gray-800"
        >
          Resend OTP
        </button>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full border-none bg-black ${
          isSubmitting ? "opacity-60" : "opacity-100"
        } text-white py-3 cursor-pointer hover:bg-gray-800 transition-colors`}
      >
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};
