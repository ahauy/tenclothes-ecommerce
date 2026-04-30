// import jwt from "jsonwebtoken";
import User from "../../../../models/user.model";
import {
  IRegisterReqBody,
} from "../../validators/client/auth.validator";
import bcrypt from "bcrypt";
// import { IDecodeToken } from "../../../../interfaces/auth.interfaces";
import ApiError from "../../../../helpers/ApiError";

export const registerService = async (
  registerData: IRegisterReqBody
): Promise<{
  _id: string;
  fullName: string;
  email: string;
}> => {
  const existingUser = await User.findOne({ email: registerData.email });
  if (existingUser) {
    throw new ApiError(409, "Email đã được sử dụng!");
  }

  const hashPassword = await bcrypt.hash(registerData.password, 10);

  const newUser = await User.create({
    fullName: registerData.fullName,
    email: registerData.email,
    password: hashPassword,
  });

  return {
    _id: newUser.id,
    fullName: newUser.fullName,
    email: newUser.email,
  };
};

// export const verifyRefreshTokenService = (refreshToken: string): (string | Error) => {
//   try {
//     const decode = jwt.verify(refreshToken, process.env["REFRESH_TOKEN_SECRET"]!) as IDecodeToken

//     const newAccessToken = jwt.sign(
//       {
//         _id: decode._id,
//         email: decode.email,
//       },
//       process.env["ACCESS_TOKEN_SECRET"]!,
//       { expiresIn: "10m" }
//     );
//     return newAccessToken;
//   } catch (error) {
//     throw new ApiError(403, "Xác thực refreshToken thất bại!")
//   }
// }

