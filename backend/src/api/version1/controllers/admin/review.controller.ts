import { Request, Response } from "express";
import Review from "../../../../models/review.model";
import ApiError from "../../../../helpers/ApiError";
import { deleteReviewAdminService } from "../../services/admin/review.service";

/**
 * Lấy danh sách đánh giá phục vụ trang quản trị (Admin Dashboard)
 * Hỗ trợ phân trang, tìm kiếm và lọc trạng thái (status, aiStatus)
 */
export const getReviewsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Lọc theo trạng thái duyệt (pending, approved, rejected)
    if (req.query["status"]) {
      filter.status = req.query["status"];
    }

    // Lọc theo cảnh báo của AI (approved, flagged, rejected)
    if (req.query["aiStatus"]) {
      filter.aiStatus = req.query["aiStatus"];
    }

    // TỐI ƯU HIỆU SUẤT: Sử dụng .lean() cho truy vấn chỉ đọc và select các trường cần thiết
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName avatar email")
      .populate("productId", "title thumbnail")
      .lean();

    const totalReviews = await Review.countDocuments(filter);

    res.status(200).json({
      status: true,
      message: "Lấy danh sách đánh giá thành công!",
      data: {
        reviews,
        pagination: {
          totalItems: totalReviews,
          totalPages: Math.ceil(totalReviews / limit),
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error: any) {
    console.error("Lỗi getReviewsAdmin: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Phê duyệt đánh giá của người dùng
 */
export const approveReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá!");
    }

    if (review.status === "approved") {
      res.status(200).json({
        status: true,
        message: "Đánh giá này đã được duyệt trước đó!",
        data: review,
      });
      return;
    }

    review.status = "approved";
    // Gọi .save() để kích hoạt middleware tự động tính toán lại rating của sản phẩm
    await review.save();

    res.status(200).json({
      status: true,
      message: "Phê duyệt đánh giá thành công!",
      data: review,
    });
  } catch (error: any) {
    console.error("Lỗi approveReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Từ chối phê duyệt đánh giá (ẩn đánh giá vi phạm hoặc nhạy cảm)
 */
export const rejectReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Không tìm thấy đánh giá!");
    }

    review.status = "rejected";
    // Gọi .save() để chạy lại rating trung bình (loại bỏ review bị reject khỏi điểm trung bình)
    await review.save();

    res.status(200).json({
      status: true,
      message: "Từ chối đánh giá thành công!",
      data: review,
    });
  } catch (error: any) {
    console.error("Lỗi rejectReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * Xóa đánh giá hoàn toàn khỏi hệ thống (Admin)
 */
export const deleteReviewAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params["id"];
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Mã đánh giá không hợp lệ!");
    }

    await deleteReviewAdminService(id);

    res.status(200).json({
      status: true,
      message: "Xóa đánh giá thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi deleteReviewAdmin: ", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
