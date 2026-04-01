import { Request, Response } from "express";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { createProductService } from "../../services/admin/product.service";


export const createProductController = async (
  req: Request<{}, {}, { cloudinaryUrls: string[] } & ICreateProductReqBody>,
  res: Response
): Promise<void> => {
  try {
    const imageUrls: string[] = req.body.cloudinaryUrls;
    const { cloudinaryUrls, ...productData } = req.body;

    const newProduct = await createProductService(imageUrls, productData);

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
      message?: string
    }

    if(err.code === 11000) {
      res.status(409).json({
        status: false,
        message: "Tên sản phẩm hoặc đường dẫn (Slug) đã tồn tại. Vui lòng chọn tên khác!",
        data: null
      })
    }

    // 2. Phân loại bệnh: CÁC LỖI SẬP HỆ THỐNG THỰC SỰ
    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
    return;
  }
};
