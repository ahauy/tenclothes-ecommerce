"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../../controllers/client/coupon.controller");
const couponRouter = (0, express_1.Router)();
// GET /api/version1/coupons
couponRouter.get("/", coupon_controller_1.getCouponsController);
// POST /api/version1/coupons/validate
couponRouter.post("/validate", coupon_controller_1.validateCouponController);
exports.default = couponRouter;
//# sourceMappingURL=coupon.routes.js.map