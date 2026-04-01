import { Model } from "mongoose";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ApiError from "../../../../helpers/ApiError";

export const loginShareService = async (
  DataModal: Model<any>,
  dataLogin: ILoginReqBody
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  const { email, password } = dataLogin;
  
  const userByEmail = await DataModal.findOne({ email: email });

  // kiểm tra các điều kiện đăng nhập
  if (userByEmail) {
    if (await bcrypt.compare(password, userByEmail.password)) {
      const accessToken = jwt.sign(
        {
          _id: userByEmail.id,
          email: userByEmail.email,
          ...(userByEmail.role && { role: userByEmail.role })
        },
        process.env["ACCESS_TOKEN_SECRET"]!,
        { expiresIn: "10m" }
      );

      const refreshToken = jwt.sign(
        {
          _id: userByEmail.id,
          email: userByEmail.email,
          ...(userByEmail.role && { role: userByEmail.role })
        },
        process.env["REFRESH_TOKEN_SECRET"]!,
        { expiresIn: "1d" }
      );

      return { accessToken, refreshToken };
    }
  }
  throw new ApiError(406, "Thông tin đăng nhập không hợp lệ");
};