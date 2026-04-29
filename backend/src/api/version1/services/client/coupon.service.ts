import mongoose from "mongoose";
import ApiError from "../../../../helpers/ApiError";
import { Coupon } from "../../../../models/coupon.model";
import { ICoupon } from "../../../../interfaces/model.interfaces";

export interface ICouponValidateResult {
  coupon: ICoupon;
  discountAmount: number; // Số tiền thực tế được giảm
  finalAmount: number;    // cartTotal - discountAmount
}

/**
 * Validate coupon và tính tiền giảm.
 * @param code      - Mã coupon (không phân biệt hoa/thường)
 * @param userId    - ID người dùng (null nếu guest)
 * @param cartTotal - Tổng tiền giỏ hàng (chưa tính phí ship)
 * @param productIds - Danh sách productId trong giỏ hàng (để kiểm tra applicableProducts)
 */
export const validateCouponService = async (
  code: string,
  userId: string | null,
  cartTotal: number,
  productIds: string[] = []
): Promise<ICouponValidateResult> => {
  // 1. Tìm coupon
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });


  if (!coupon) {
    throw new ApiError(404, "Mã giảm giá không tồn tại!");
  }

  // 2. Kiểm tra đang active
  if (!coupon.isActive) {
    throw new ApiError(400, "Mã giảm giá này đã bị vô hiệu hoá!");
  }

  // 3. Kiểm tra hạn sử dụng
  if (new Date() > coupon.expiresAt) {
    throw new ApiError(400, "Mã giảm giá đã hết hạn sử dụng!");
  }

  // 4. Kiểm tra còn lượt dùng không
  if (coupon.usageCount >= coupon.maxUsage) {
    throw new ApiError(400, "Mã giảm giá đã hết lượt sử dụng!");
  }

  // 5. Kiểm tra user đã dùng chưa (chỉ khi đăng nhập)
  if (userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const alreadyUsed = coupon.usedBy.some((id) => id.equals(userObjectId));
    if (alreadyUsed) {
      throw new ApiError(400, "Bạn đã sử dụng mã giảm giá này rồi!");
    }
  }

  // 6. Kiểm tra đơn tối thiểu
  if (cartTotal < coupon.minOrderAmount) {
    const minFmt = coupon.minOrderAmount.toLocaleString("vi-VN");
    throw new ApiError(
      400,
      `Đơn hàng tối thiểu ${minFmt}đ để dùng mã này!`
    );
  }

  // 7. Kiểm tra sản phẩm áp dụng (nếu coupon có giới hạn sản phẩm)
  if (coupon.applicableProducts.length > 0 && productIds.length > 0) {
    const applicableSet = new Set(
      coupon.applicableProducts.map((id) => id.toString())
    );
    const hasEligibleProduct = productIds.some((pid) => applicableSet.has(pid));
    if (!hasEligibleProduct) {
      throw new ApiError(400, "Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng của bạn!");
    }
  }

  // 8. Tính tiền giảm
  let discountAmount = 0;

  if (coupon.discountType === "fixed") {
    discountAmount = coupon.discountValue;
  } else {
    // percentage
    discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    // Áp dụng giới hạn tối đa (nếu có)
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  }

  // Đảm bảo không giảm quá tổng đơn hàng
  discountAmount = Math.min(discountAmount, cartTotal);

  const finalAmount = cartTotal - discountAmount;

  return { coupon, discountAmount, finalAmount };
};

/**
 * Lấy danh sách coupon đang hoạt động và còn hạn.
 */
export const getAvailableCouponsService = async (): Promise<ICoupon[]> => {
  const now = new Date();
  // Lấy tất cả coupon active trước, sau đó lọc date ở JS để tránh lỗi type String vs Date trong MongoDB
  const coupons = await Coupon.find({ isActive: true }).sort({ createdAt: -1 });
  
  const availableCoupons = coupons.filter(coupon => {
    const expiryDate = new Date(coupon.expiresAt);
    return expiryDate > now;
  });

  return availableCoupons;
};
