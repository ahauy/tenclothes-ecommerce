import { Request, Response } from "express";
import {
  changeStatusProductService,
  createProductService,
  deleteProductService,
  changeFeaturedProductService,
  updateProductService,
  getListProductAdminService,
  restoreProductService,
  getProductHistoryService,
} from "../../services/admin/product.service";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import { IStaffReq } from "../../../../helpers/writeProductLog";


export const getListProductAdminController = async (
  req: Request<{}, {}, {}, IRequestQueryFilter>,
  res: Response
): Promise<void> => {
  try {
    const result = await getListProductAdminService(req.query);

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm thành công!",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi trong getListProductAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const createProductController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;
    const staff = req.user as IStaffReq; // Lấy thông tin người thực hiện từ middleware

    const newProduct = await createProductService(productData, staff);

    res.status(201).json({
      status: true,
      message: "Tạo mới sản phẩm thành công!",
      data: {
        product: newProduct,
      },
    });
  } catch (error: any) {
    console.log("Có lỗi trong createProductController: ", error);
    if (error.code === 11000) {
      res.status(409).json({
        status: false,
        message: "Tên sản phẩm, đường dẫn (Slug) hoặc mã SKU đã tồn tại!",
      });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const updateProductController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const productData = req.body;
    const staff = req.user as IStaffReq;

    const updatedProduct = await updateProductService(slug, productData, staff);

    if (!updatedProduct) {
      res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật sản phẩm thành công!",
      data: { product: updatedProduct },
    });
  } catch (error: any) {
    console.log("Có lỗi trong updateProductController: ", error);
    if (error.code === 11000) {
      res.status(409).json({ status: false, message: "Mã SKU hoặc Slug đã tồn tại!" });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const changeStatusProductController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const { status } = req.body;
    const staff = req.user as IStaffReq;

    const updatedProduct = await changeStatusProductService(slug, status, staff);

    if (!updatedProduct) {
      res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
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
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const { isFeatured } = req.body;
    const staff = req.user as IStaffReq;

    const updatedProduct = await changeFeaturedProductService(slug, isFeatured, staff);

    if (!updatedProduct) {
      res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
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
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const staff = req.user as IStaffReq;

    const deletedProduct = await deleteProductService(slug, staff);

    if (!deletedProduct) {
      res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm!" });
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

/**
 * API Khôi phục sản phẩm
 */
export const restoreProductController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const staff = req.user as IStaffReq;

    const result = await restoreProductService(slug, staff);

    if (!result.success) {
      res.status(403).json({ status: false, message: result.message });
      return;
    }

    res.status(200).json({
      status: true,
      message: result.message,
      data: result.product,
    });
  } catch (error) {
    console.error("Lỗi trong restoreProductController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * API Lấy lịch sử sản phẩm
 */
export const getProductHistoryController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const history = await getProductHistoryService(slug);

    res.status(200).json({
      status: true,
      message: "Lấy lịch sử sản phẩm thành công!",
      data: history,
    });
  } catch (error) {
    console.error("Lỗi trong getProductHistoryController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
