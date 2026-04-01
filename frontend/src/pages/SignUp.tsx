import { NavLink, useNavigate } from "react-router-dom"; // Nhớ dùng react-router-dom
import axios from "axios";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValue } from "../validators/signUp.validate";
import type { IJsonFail } from "../interfaces/iAuthState";
import { authServices } from "../services/authService";


const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValue>({
    resolver: zodResolver(signUpSchema),
  });

  const navigate = useNavigate();

  const onSubmitForm: SubmitHandler<SignUpFormValue> = async (data: SignUpFormValue) => {
    try {
      const res = await authServices.registerService(data.fullName, data.email, data.password, data.confirmPassword)

      if (res.data.status) {
        toast.success("Tạo tài khoản thành công!");
        navigate("/login");
      }
    } catch (error: unknown) {
      if(axios.isAxiosError<IJsonFail>(error) && error.response?.data) {
        const serverDataError = error.response.data

        if(serverDataError.errors && serverDataError.errors.length > 0) {
          serverDataError.errors.forEach(err => {
            setError(err.field as keyof SignUpFormValue, {
              type: "server",
              message: err.message
            })
          })
          toast.error("Vui lòng kiểm tra lại dữ liệu!")
        } else {
          toast.error(serverDataError.message || "Đăng ký thất bại!");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Sign Up</p>
        <hr className="border-none w-8 bg-gray-800 h-[1.5px]" />
      </div>

      {/* Ô Nhập Full Name */}
      <div className="w-full">
        <input
          {...register("fullName")}
          type="text"
          className={`w-full px-3 py-2 border ${errors.fullName ? "border-red-500" : " border-gray-800"}`}
          placeholder="Enter your full name"
          required
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>
      

      {/* Ô Nhập Email */}
      <div className="w-full">
        <input
          {...register("email")}
          type="email"
          className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : " border-gray-800"}`}
          placeholder="Enter your email"
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Ô Nhập Password */}
      <div className="w-full">
        <input
          {...register("password")}
          type="password"
          className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : " border-gray-800"}`}
          placeholder="Enter your password"
          required
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Ô Nhập Confirm Password (Bổ sung theo API của bạn) */}
      <div className="w-full">
        <input
          {...register("confirmPassword")}
          type="password"
          className={`w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-500" : " border-gray-800"}`}
          placeholder="Confirm your password"
          required
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <div className="w-full flex justify-end text-sm -mt-2">
        <NavLink to="/Login" className="hover:underline">
          Login here
        </NavLink>
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full border-none bg-black ${isSubmitting ? "opacity-60": "opacity-100"} text-white py-3 cursor-pointer hover:bg-gray-800 transition-colors`}
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
