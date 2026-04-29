import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../../../../helpers/ApiError";
import { validateCouponService, getAvailableCouponsService } from "../../services/client/coupon.service";

/**
 * GET /api/version1/coupons
 */
export const getCouponsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const coupons = await getAvailableCouponsService();
    res.status(200).json({
      status: true,
      data: coupons,
    });
  } catch (error) {
    console.error("Lỗi getCoupons:", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

/**
 * POST /api/version1/coupons/validate
 * Body: { code: string, cartTotal: number, productIds?: string[] }
 */
export const validateCouponController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, cartTotal, productIds = [] } = req.body;

    if (!code || typeof code !== "string") {
      throw new ApiError(400, "Vui lòng nhập mã giảm giá!");
    }
    if (typeof cartTotal !== "number" || cartTotal < 0) {
      throw new ApiError(400, "Tổng giỏ hàng không hợp lệ!");
    }

    // Lấy userId từ token nếu đã đăng nhập (optional — guest vẫn dùng được)
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token!, process.env["ACCESS_TOKEN_SECRET"]!) as any;
        userId = decoded._id;
      } catch {
        // token lỗi → bỏ qua, coi như guest
      }
    }

    const result = await validateCouponService(code, userId, cartTotal, productIds);

    res.status(200).json({
      status: true,
      message: "Mã giảm giá hợp lệ!",
      data: {
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        maxDiscountAmount: result.coupon.maxDiscountAmount,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    console.error("Lỗi validateCoupon:", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
