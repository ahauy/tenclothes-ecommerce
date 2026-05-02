import { Request, Response } from "express";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { changeStatusProductService, createProductService } from "../../services/admin/product.service";
import Product from "../../../../models/product.model";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";

export const getListProductAdminController = async (
  req: Request<{}, {}, {}, IRequestQueryFilter>,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, keyword, isActive, isFeatured, categoryId, sort } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { deleted: false };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "variants.sku": { $regex: keyword, $options: "i" } }
      ];
    }

    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (categoryId) query.categoryId = categoryId;

    const sortObj: any = {};
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;
      sortObj[field] = isDesc ? -1 : 1;
    } else {
      sortObj.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate("categoryId", "title")
      .sort(sortObj)
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
  req: Request<{}, {}, ICreateProductReqBody>, 
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;
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
      return; 
    }

    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
    return;
  }
};

export const changeStatusProductController = async (
  req: Request<{ id: string }, {}, { status: boolean }> ,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedProduct = await changeStatusProductService(id, status);

    if (!updatedProduct) {
      res.status(404).json({
        status: false,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật trạng thái sản phẩm thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi trong changeStatusProductController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};