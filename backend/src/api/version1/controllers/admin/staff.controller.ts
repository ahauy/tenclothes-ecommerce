import { Request, Response } from "express";
import {
  getListStaffsService,
  createStaffService,
  updateStaffService,
  softDeleteStaffService,
} from "../../services/admin/staff.service";
import ApiError from "../../../../helpers/ApiError";

// 1. Get List Staffs
export const getListStaffsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: { page?: string; limit?: string; keyword?: string } = {};
    if (typeof req.query["page"] === "string") {
      query.page = req.query["page"];
    }
    if (typeof req.query["limit"] === "string") {
      query.limit = req.query["limit"];
    }
    if (typeof req.query["keyword"] === "string") {
      query.keyword = req.query["keyword"];
    }
    
    const result = await getListStaffsService(query);

    res.status(200).json({
      status: true,
      message: "Lấy danh sách nhân viên thành công!",
      data: result,
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const statusCode = apiError.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: apiError.message || "Lỗi server nội bộ",
    });
  }
};

// 2. Create Staff Account
export const createStaffController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createStaffService(req.body);

    res.status(201).json({
      status: true,
      message: "Tạo tài khoản nhân viên thành công!",
      data: result,
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const statusCode = apiError.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: apiError.message || "Lỗi server nội bộ",
    });
  }
};

// 3. Update Staff Account
export const updateStaffController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params["id"];
    if (typeof id !== "string") {
      throw new ApiError(400, "Thiếu ID nhân viên");
    }

    const result = await updateStaffService(id, req.body);

    res.status(200).json({
      status: true,
      message: "Cập nhật tài khoản nhân viên thành công!",
      data: result,
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const statusCode = apiError.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: apiError.message || "Lỗi server nội bộ",
    });
  }
};

// 4. Delete Staff Account
export const deleteStaffController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params["id"];
    if (typeof id !== "string") {
      throw new ApiError(400, "Thiếu ID nhân viên");
    }

    await softDeleteStaffService(id);

    res.status(200).json({
      status: true,
      message: "Xóa tài khoản nhân viên thành công!",
    });
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const statusCode = apiError.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: apiError.message || "Lỗi server nội bộ",
    });
  }
};
