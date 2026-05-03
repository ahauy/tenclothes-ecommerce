import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IDecodeToken } from "../interfaces/auth.interfaces";

export interface IAuthRequest extends Request {
  user?: {
    _id: string;
    email?: string;
    role?: string;
    fullName?: string;
  };
}

export const verifyToken = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({
          message: "Không tìm thấy Access Token! Vui lòng đăng nhập lại!",
        });
      return;
    }

    const token: string = authHeader.split(" ")[1] as string;

    const decode = jwt.verify(
      token,
      process.env["ACCESS_TOKEN_SECRET"]!
    ) as IDecodeToken;

    req.user = {
      _id: decode._id,
      email: decode.email,
      fullName: decode["fullName"],
      ...(decode.role && { role: decode.role })
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
