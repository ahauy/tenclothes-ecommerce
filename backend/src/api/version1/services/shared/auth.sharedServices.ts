import { Model } from "mongoose";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ApiError from "../../../../helpers/ApiError";
import { IDecodeToken } from "../../../../interfaces/auth.interfaces";

export const loginShareService = async (
  DataModal: Model<any>,
  dataLogin: ILoginReqBody
): Promise<{ accessToken: string; refreshToken: string; user: any } | null> => {
  const { email, password } = dataLogin;

  const userByEmail = await DataModal.findOne({ email: email, deleted: false })

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

      const { password, ...userWithoutPassword } = userByEmail.toObject();

      return { accessToken, refreshToken, user: userWithoutPassword };
    }
  }
  throw new ApiError(406, "Thông tin đăng nhập không hợp lệ");
};

export const verifyRefreshTokenShareService = (refreshToken: string): (string | Error) => {
  try {
    const decode = jwt.verify(refreshToken, process.env["REFRESH_TOKEN_SECRET"]!) as IDecodeToken

    const newAccessToken = jwt.sign(
      {
        _id: decode._id,
        email: decode.email,
        ...(decode.role && { role: decode.role })
      },
      process.env["ACCESS_TOKEN_SECRET"]!,
      { expiresIn: "10m" }
    );
    return newAccessToken;
  } catch (error) {
    throw new ApiError(403, "Xác thực refreshToken thất bại!")
  }
}