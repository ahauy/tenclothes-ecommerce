// import jwt from "jsonwebtoken";
import User from "../../../../models/user.model";
import ForgotPassword from "../../../../models/forgotPassword.model";
import {
  IRegisterReqBody,
  IResetPasswordReqBody,
} from "../../validators/client/auth.validator";
import bcrypt from "bcrypt";
// import { IDecodeToken } from "../../../../interfaces/auth.interfaces";
import ApiError from "../../../../helpers/ApiError";
import { randomCode } from "../../../../helpers/randomCode";
import { sendMail } from "../../../../helpers/sendMail";

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

export const forgotPasswordService = async (email: string): Promise<void> => {
  const user = await User.findOne({ email, deleted: false, isActive: true }).lean();
  if (!user) {
    throw new ApiError(404, "Email không tồn tại trong hệ thống hoặc tài khoản bị khóa!");
  }

  const otp = randomCode(6);

  await ForgotPassword.deleteMany({ email });

  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  await ForgotPassword.create({
    email,
    otp,
    expireAt,
  });

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333; text-align: center; text-transform: uppercase;">Yêu cầu Đặt lại mật khẩu</h2>
      <p>Chào bạn <strong>${user.fullName}</strong>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>TenClothes Store</strong>.</p>
      <p>Dưới đây là mã xác thực OTP của bạn:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 5px; padding: 10px 20px; background-color: #f5f5f5; border: 1px dashed #ccc; border-radius: 4px;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px;">Mã OTP này có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} TenClothes Store. All rights reserved.</p>
    </div>
  `;

  await sendMail(email, "Mã OTP xác thực đặt lại mật khẩu - TenClothes", html);
};

export const verifyOtpService = async (email: string, otp: string): Promise<void> => {
  const record = await ForgotPassword.findOne({ email, otp }).lean();
  if (!record) {
    throw new ApiError(400, "Mã OTP không chính xác!");
  }

  if (new Date() > record.expireAt) {
    throw new ApiError(400, "Mã OTP đã hết hạn!");
  }
};

export const resetPasswordService = async (data: IResetPasswordReqBody): Promise<void> => {
  const record = await ForgotPassword.findOne({ email: data.email, otp: data.otp }).lean();
  if (!record) {
    throw new ApiError(400, "Mã OTP không chính xác hoặc đã được sử dụng!");
  }

  if (new Date() > record.expireAt) {
    throw new ApiError(400, "Mã OTP đã hết hạn!");
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  const updatedUser = await User.updateOne(
    { email: data.email, deleted: false },
    { password: hashPassword }
  );

  if (updatedUser.matchedCount === 0) {
    throw new ApiError(404, "Tài khoản không tồn tại trên hệ thống!");
  }

  await ForgotPassword.deleteMany({ email: data.email });
};

