import { Request, Response } from "express";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
import { loginShareService } from "../../services/shared/auth.sharedServices";
import { Model } from "mongoose";
import ApiError from "../../../../helpers/ApiError";

export const loginShareController = (DataModel: Model<any>) => {
  return async (
    req: Request<{}, {}, ILoginReqBody>,
    res: Response
  ): Promise<void> => {
    try {
      const loginData = req.body;

      const data = await loginShareService(DataModel, loginData);

      if (data) {
        res.cookie("jwt", data.refreshToken, {
          httpOnly: true, 
          sameSite: "lax",
          secure: false,
          maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({
          status: true,
          message: "Đăng nhập thành công!",
          accessToken: data.accessToken,
        });

        return;
      }
    } catch (error) {
      console.error("Có lỗi trong loginController: ", error);

      // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: false,
          message: error.message, // Sẽ in ra "Email đã được sử dụng!"
        });
        return;
      }

      // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
      res.status(500).json({ message: "Lỗi hệ thống!" });
    }
  };
};
