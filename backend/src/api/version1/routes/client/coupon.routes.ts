import { Router } from "express";
import { validateCouponController, getCouponsController } from "../../controllers/client/coupon.controller";

const couponRouter = Router();

// GET /api/version1/coupons
couponRouter.get("/", getCouponsController);

// POST /api/version1/coupons/validate
couponRouter.post("/validate", validateCouponController);

export default couponRouter;
