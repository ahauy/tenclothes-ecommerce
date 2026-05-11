import { ICoupon } from "../../../../interfaces/model.interfaces";
export interface ICouponValidateResult {
    coupon: ICoupon;
    discountAmount: number;
    finalAmount: number;
}
/**
 * Validate coupon và tính tiền giảm.
 * @param code      - Mã coupon (không phân biệt hoa/thường)
 * @param userId    - ID người dùng (null nếu guest)
 * @param cartTotal - Tổng tiền giỏ hàng (chưa tính phí ship)
 * @param productIds - Danh sách productId trong giỏ hàng (để kiểm tra applicableProducts)
 */
export declare const validateCouponService: (code: string, userId: string | null, cartTotal: number, productIds?: string[]) => Promise<ICouponValidateResult>;
/**
 * Lấy danh sách coupon đang hoạt động và còn hạn.
 */
export declare const getAvailableCouponsService: () => Promise<ICoupon[]>;
//# sourceMappingURL=coupon.service.d.ts.map