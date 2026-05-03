import ApiError from "../../../../helpers/ApiError";
import { Request, Response } from "express";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import { CreateReviewReqBody } from "../../validators/client/review.validator";
import { createViewProductService, getReviewsByProductService } from "../../services/client/review.service";

export const createReviewProduct = async (
  req: Request<{}, {}, CreateReviewReqBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).user!._id;
    const { productId, orderId, rating, content } = req.body;
    const images = (req.body as any).cloudinaryUrls || [];

    const reviewNew = await createViewProductService({
      userId,
      productId,
      orderId,
      rating,
      content,
      images,
    });

    res.status(201).json({
      status: true,
      message: "Đánh giá sản phẩm thành công!",
      data: reviewNew,
    });
  } catch (error: any) {
    // Định nghĩa type any hoặc bắt type cho error
    console.error("Có lỗi trong createReviewProduct: ", error);

    // 5. BẢO MẬT HIỆU SUẤT: Xử lý lỗi trùng lặp từ MongoDB (Mã 11000)
    // Nếu user spam click hoặc cố tình gửi request liên tục
    if (error.code === 11000) {
      res.status(400).json({
        status: false,
        message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!",
      });
      return;
    }

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params as { productId: string };
    const reviews = await getReviewsByProductService(productId);
    res.status(200).json({
      status: true,
      message: "Lấy danh sách đánh giá thành công",
      data: reviews
    });
  } catch (error: any) {
    console.error("Lỗi getReviewsByProduct: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
