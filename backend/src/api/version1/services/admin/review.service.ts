import Review from "../../../../models/review.model";
import ApiError from "../../../../helpers/ApiError";

export const deleteReviewAdminService = async (id: string): Promise<void> => {
  const review = await Review.findById(id).lean();
  if (!review) {
    throw new ApiError(404, "Không tìm thấy đánh giá!");
  }

  // Sử dụng findByIdAndDelete để kích hoạt middleware query pre/post findOneAnd...
  // giúp tự động tính toán lại điểm rating trung bình của sản phẩm
  await Review.findByIdAndDelete(id);
};
