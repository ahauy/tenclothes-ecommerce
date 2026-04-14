import { Request, Response } from "express"
import ApiError from "../../../../helpers/ApiError";
import { categoryTreeClientService } from "../../services/client/category.service";

export const categoryTreeClient = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categoryTree = await categoryTreeClientService()

    res.status(200).json({
      status: true,
      message: "Lấy cây thư mục thành công!",
      data: categoryTree
    })
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
}