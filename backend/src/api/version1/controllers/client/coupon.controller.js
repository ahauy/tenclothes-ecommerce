"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCouponController = exports.getCouponsController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const coupon_service_1 = require("../../services/client/coupon.service");
/**
 * GET /api/version1/coupons
 */
const getCouponsController = async (_req, res) => {
    try {
        const coupons = await (0, coupon_service_1.getAvailableCouponsService)();
        res.status(200).json({
            status: true,
            data: coupons,
        });
    }
    catch (error) {
        console.error("Lỗi getCoupons:", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getCouponsController = getCouponsController;
/**
 * POST /api/version1/coupons/validate
 * Body: { code: string, cartTotal: number, productIds?: string[] }
 */
const validateCouponController = async (req, res) => {
    try {
        const { code, cartTotal, productIds = [] } = req.body;
        if (!code || typeof code !== "string") {
            throw new ApiError_1.default(400, "Vui lòng nhập mã giảm giá!");
        }
        if (typeof cartTotal !== "number" || cartTotal < 0) {
            throw new ApiError_1.default(400, "Tổng giỏ hàng không hợp lệ!");
        }
        // Lấy userId từ token nếu đã đăng nhập (optional — guest vẫn dùng được)
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jsonwebtoken_1.default.verify(token, process.env["ACCESS_TOKEN_SECRET"]);
                userId = decoded._id;
            }
            catch {
                // token lỗi → bỏ qua, coi như guest
            }
        }
        const result = await (0, coupon_service_1.validateCouponService)(code, userId, cartTotal, productIds);
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
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        console.error("Lỗi validateCoupon:", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.validateCouponController = validateCouponController;
//# sourceMappingURL=coupon.controller.js.map