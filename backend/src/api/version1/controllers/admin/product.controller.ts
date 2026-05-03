import { Request, Response } from "express";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { changeStatusProductService, createProductService, deleteProductService, changeFeaturedProductService, updateProductService } from "../../services/admin/product.service";
import Product from "../../../../models/product.model";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";

export const getListProductAdminController = async (
  req: Request<{}, {}, {}, IRequestQueryFilter>,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, keyword, isActive, isFeatured, categoryId, sort, startDate, endDate } = req.query;
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
    if (categoryId) query.categoryIds = categoryId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sortObj: any = {};
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;
      sortObj[field] = isDesc ? -1 : 1;
    } else {
      sortObj.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate("categoryIds", "title")
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

    console.log("productData: ", productData);
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

export const updateProductController = async (
  req: Request<{ slug: string }, {}, ICreateProductReqBody>, 
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const productData = req.body;

    const updatedProduct = await updateProductService(slug, productData);

    if (!updatedProduct) {
      res.status(404).json({
        status: false,
        message: "Không tìm thấy sản phẩm!",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật sản phẩm thành công!",
      data: {
        product: updatedProduct,
      },
    });
    return;
  } catch (error) {
    console.log("Có lỗi trong updateProductController: ", error);

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
  req: Request<{ slug: string }, {}, { status: boolean }> ,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { status } = req.body;

    const updatedProduct = await changeStatusProductService(slug, status);

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

export const changeFeaturedProductController = async (
  req: Request<{ slug: string }, {}, { isFeatured: boolean }> ,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { isFeatured } = req.body;

    const updatedProduct = await changeFeaturedProductService(slug, isFeatured);

    if (!updatedProduct) {
      res.status(404).json({
        status: false,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật sản phẩm nổi bật thành công!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi trong changeFeaturedProductController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const deleteProductController = async (
  req: Request<{ slug: string }>, 
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const deletedProduct = await deleteProductService(slug);

    if (!deletedProduct) {
      res.status(404).json({
        status: false,
        message: "Không tìm thấy sản phẩm!",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Xóa sản phẩm thành công!",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Lỗi trong deleteProductController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};  

