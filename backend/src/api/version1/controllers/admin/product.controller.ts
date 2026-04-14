import { Request, Response } from "express";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { createProductService } from "../../services/admin/product.service";

export const createProductController = async (
  req: Request<{}, {}, ICreateProductReqBody>, // Bỏ cloudinaryUrls flat array đi
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;

    // Gửi toàn bộ dữ liệu đã được Zod validate xuống Service
    const newProduct = await createProductService(productData);

    res.status(201).json({
      status: true,
      message: "Tạo mới sản phẩm thành công!",
      data: {
        product: newProduct,
      },
    });
    return;
  } catch (error) {
    console.log("Có lỗi trong createProductController: ", error);

    const err = error as {
      code?: number;
      message?: string;
    };

    if (err.code === 11000) {
      res.status(409).json({
        status: false,
        message: "Tên sản phẩm, đường dẫn (Slug) hoặc mã SKU đã tồn tại. Vui lòng kiểm tra lại!",
        data: null,
      });
      return; // Nhớ thêm return ở đây để tránh lỗi Header gửi 2 lần
    }

    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
    return;
  }
};