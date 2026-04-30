import { Request, Response } from "express";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
import {
  loginShareService,
  verifyRefreshTokenShareService,
} from "../../services/shared/auth.sharedServices";
import { Model } from "mongoose";
import ApiError from "../../../../helpers/ApiError";

export const loginShareController = (DataModel: Model<any>) => {
  return async (
    req: Request<{}, {}, ILoginReqBody>,
    res: Response,
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
          data: data.user,
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

export const refreshShareController = () => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies["jwt"];

      if (!refreshToken) {
        res.status(401).json({
          message: "Không tìm thấy quyền truy cập. Vui lòng đăng nhập lại!",
        });
        return;
      }

      const newAccessToken: string = verifyRefreshTokenShareService(
        refreshToken,
      ) as string;

      res.status(200).json({
        message: "Tạo mới accessToken thành công!",
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error("Có lỗi trong refreshController: ", error);

      // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          status: false,
          message: error.message,
        });
        return;
      }

      // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
      res.status(500).json({ message: "Lỗi hệ thống!" });
    }
  };
};

export const logoutShareController = () => {
  return (_req: Request, res: Response): void => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
      console.log("Có lỗi trong loginController: ", error);

      res.status(500).json({ message: "Lỗi hệ thống!" });
    }
  };
};
