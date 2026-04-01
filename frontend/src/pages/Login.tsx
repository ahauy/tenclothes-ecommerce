import { NavLink, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import axios from "axios";
import { type loginFormValue } from "../validators/signUp.validate";
// import type { IJsonFail } from "../interfaces/iAuthState";
import { useAuthStore } from "../stores/useAuthStore";
import { authServices } from "../services/authService";


const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValue>();

  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const navigate = useNavigate();


  const onSubmit: SubmitHandler<loginFormValue> = async (
    data: loginFormValue
  ) => {
    try {
      const res = await authServices.logInService(data.email, data.password)

      if (res.data?.status) {
        setAccessToken(res.data.accessToken);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch {
      // if (axios.isAxiosError<IJsonFail>(error) && error.response?.data) {
      //   const serverDataError = error.response.data;

      //   if (serverDataError.errors && serverDataError.errors.length > 0) {
      //     serverDataError.errors.forEach((err) => {
      //       setError(err.field as keyof loginFormValue, {
      //         type: "server",
      //         message: err.message,
      //       });
      //     });
      //     toast.error("Vui lòng kiểm tra lại dữ liệu!");
      //   } else {
      //     toast.error(serverDataError.message || "Đăng nhập thất bại!");
      //   }
      // }
      toast.error("Email hoặc mật khẩu không hợp lệ!")
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 h-full m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Login</p>
        <hr className="border-none w-8 bg-gray-800 h-[1.5px]" />
      </div>
      {/* Ô Nhập Email */}
      <div className="w-full">
        <input
          {...register("email")}
          type="email"
          className={`w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : " border-gray-800"
          }`}
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Ô Nhập Password */}
      <div className="w-full">
        <input
          {...register("password")}
          type="password"
          className={`w-full px-3 py-2 border ${
            errors.password ? "border-red-500" : " border-gray-800"
          }`}
          placeholder="Enter your password"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="w-full flex justify-between text-sm -mt-2">
        <p className="cursor-point">Forgot your password?</p>
        <NavLink to="/sign-up">Create account</NavLink>
      </div>

      <button
        type="submit"
        className="w-full border-none bg-black text-white py-3 cursor-pointer"
      >
        Login
      </button>
    </form>
  );
};
export default Login;
