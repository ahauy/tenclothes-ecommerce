import ApiError from "../../../../helpers/ApiError";
import { Order } from "../../../../models/order.model";
import Review from "../../../../models/review.model";

interface CreateReviewParams {
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  content: string;
  images?: string[] | undefined;
}

export const createViewProductService = async ({
  userId,
  productId,
  orderId,
  rating,
  content,
  images,
}: CreateReviewParams) => {
  // 1. TỐI ƯU QUERY: Gom 3 điều kiện vào 1 câu truy vấn Database
  const order = await Order.findOne({
    _id: orderId,
    userId: userId, // Đảm bảo đơn hàng thuộc về user này
    "items.productId": productId, // Đảm bảo sản phẩm này THỰC SỰ CÓ trong đơn hàng
  }).lean();

  if (!order) {
    throw new ApiError(
      404,
      "Không tìm thấy đơn hàng hợp lệ hoặc sản phẩm không thuộc đơn hàng này!"
    );
  }

  // 2. BẢO MẬT LOGIC: Kiểm tra trạng thái đơn hàng (Rất quan trọng)
  if (order.orderStatus !== "delivered") {
    throw new ApiError(
      403,
      "Chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao thành công!"
    );
  }

  // 3. Lấy thông tin phân loại hàng
  const itemProduct = order.items.find(
    (item) => String(item.productId) === String(productId)
  );

  const variantInfo = {
    color: itemProduct?.color || "",
    size: itemProduct?.size || "",
  };

  // 4. Khởi tạo và lưu Review
  const reviewNew = new Review({
    userId,
    productId,
    orderId,
    rating,
    content,
    images: images || [],
    variantInfo,
  });

  await reviewNew.save();

  return reviewNew;
};

export const getReviewsByProductService = async (productId: string) => {
  const reviews = await Review.find({ productId: productId, status: "approved" })
    .sort({ createdAt: -1 })
    .populate("userId", "fullName avatar")
    .lean();
  return reviews;
};
