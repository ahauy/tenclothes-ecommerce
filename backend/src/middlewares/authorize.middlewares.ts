import { AuthRequest } from "./authen.middlewares";
import { Response, NextFunction } from "express";

export const authorizationRole = (allowedRoles: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      const role = req.user?.role;

      if (!role) {
        res
          .status(403)
          .json({ message: "Bạn chưa được cấp quyền cho chức năng trên!" });
        return;
      }

      if (role.includes("admin")) {
        next();
        return;
      }

      if (allowedRoles.includes(role)) {
        next();
        return;
      } else {
        res
          .status(403)
          .json({ message: "Bạn chưa được cấp quyền cho chức năng trên!" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi hệ thống kiểm tra phân quyền!" });
    }
  };
};
