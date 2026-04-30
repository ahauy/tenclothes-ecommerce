import { type Request, type Response } from "express";
import { IRegisterReqBody } from "../../validators/client/auth.validator";
import {
  registerService,
  // verifyRefreshTokenService,
} from "../../services/client/auth.service";
import ApiError from "../../../../helpers/ApiError";

export const registerController = async (
  req: Request<{}, {}, IRegisterReqBody>,
  res: Response
): Promise<void> => {
  try {
    const registerData = req.body;

    const data = await registerService(registerData);

    res.status(201).json({
      status: true,
      message: "Tạo tài khoàn thành công!",
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.error("Có lỗi trong registerController: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
  }
};

// export const refreshController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const refreshToken = req.cookies["jwt"];

//     if (!refreshToken) {
//       res.status(401).json({
//         message: "Không tìm thấy quyền truy cập. Vui lòng đăng nhập lại!",
//       });
//       return;
//     }

//     const newAccessToken: string = verifyRefreshTokenService(
//       refreshToken
//     ) as string;

//     res.status(200).json({
//       message: "Tạo mới accessToken thành công!",
//       accessToken: newAccessToken,
//     });
//   } catch (error) {
//     console.error("Có lỗi trong refreshController: ", error);

//     // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
//     if (error instanceof ApiError) {
//       res.status(error.statusCode).json({
//         status: false,
//         message: error.message,
//       });
//       return;
//     }

//     // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
//     res.status(500).json({ message: "Lỗi hệ thống!" });
//   }
// };

// export const logoutController = (_req: Request, res: Response): void => {
//   try {
//     res.clearCookie("jwt", {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//     });
//     res.status(200).json({ message: "Đăng xuất thành công!" });
//   } catch (error) {
//     console.log("Có lỗi trong loginController: ", error);

//     res.status(500).json({ message: "Lỗi hệ thống!" });
//   }
// };
