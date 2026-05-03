import { Request, Response } from "express"
import ApiError from "../../../../helpers/ApiError";
import { categoryTreeAdminService } from "../../services/admin/category.service";

export const categoryTreeAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categoryTree = await categoryTreeAdminService()

    res.status(200).json({
      status: true,
      message: "Lấy cây thư mục thành công!",
      data: categoryTree
    })
  } catch (error) {
    console.error("Có lỗi trong categoryTreeAdmin: ", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}
