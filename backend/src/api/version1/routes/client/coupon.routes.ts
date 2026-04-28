import { Router } from "express";
import { validateCouponController } from "../../controllers/client/coupon.controller";

const couponRouter = Router();

// POST /api/version1/coupons/validate
couponRouter.post("/validate", validateCouponController);

export default couponRouter;
