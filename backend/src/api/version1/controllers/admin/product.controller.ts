import { Request, Response } from "express";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { createProductService } from "../../services/admin/product.service";
import Product from "../../../../models/product.model";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";

export const getListProductAdminController = async (
  req: Request<{}, {}, {}, IRequestQueryFilter>,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, keyword } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { deleted: false };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "variants.sku": { $regex: keyword, $options: "i" } }
      ];
    }

    const products = await Product.find(query)
      .populate("categoryId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / Number(limit));

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm thành công!",
      data: {
        products,
        currentPage: Number(page),
        totalPages,
        totalProducts,
      },
    });
  } catch (error) {
    console.error("Lỗi trong getListProductAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

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