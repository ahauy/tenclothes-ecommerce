import { Request, Response } from "express";
import {
  getUserByIdAdminService,
  updateUserStatusAdminService,
  softDeleteUserAdminService,
  getListOrderAdminService,
} from "../../services/admin/user.service";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";

// 1. Get Users
export const getListUserAdminController = async (req: Request<{}, {}, {}, IRequestQueryFilter>, res: Response) => {
  try {
    const result = await getListOrderAdminService(req.query)

    res.status(200).json({
      status: true,
      message: "Lấy danh sách người dùng thành công!",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: error.message || "Lỗi server nội bộ",
    });
  }
};

// 2. Get User By ID
export const getUserByIdAdminController = async (req: Request, res: Response) => {
  try {
    const userId = req.params["id"];
    const user = await getUserByIdAdminService(userId as string);
    res.status(200).json({
      status: true,
      message: "Lấy chi tiết người dùng thành công!",
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: error.message || "Lỗi server nội bộ",
    });
  }
};

// 3. Update User Status
export const updateUserStatusAdminController = async (req: Request, res: Response) => {
  try {
    const userId = req.params["id"];
    const { isActive } = req.body;

    const user = await updateUserStatusAdminService(userId as string, isActive);
    res.status(200).json({
      status: true,
      message: "Cập nhật trạng thái người dùng thành công!",
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: error.message || "Lỗi server nội bộ",
    });
  }
};

// 4. Delete User
export const deleteUserAdminController = async (req: Request, res: Response) => {
  try {
    const userId = req.params["id"];
    await softDeleteUserAdminService(userId as string);
    
    res.status(200).json({
      status: true,
      message: "Xóa người dùng thành công!",
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: error.message || "Lỗi server nội bộ",
    });
  }
};
