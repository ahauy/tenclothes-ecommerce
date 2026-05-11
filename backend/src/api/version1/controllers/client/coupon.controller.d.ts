import { type Request, type Response } from "express";
/**
 * GET /api/version1/coupons
 */
export declare const getCouponsController: (_req: Request, res: Response) => Promise<void>;
/**
 * POST /api/version1/coupons/validate
 * Body: { code: string, cartTotal: number, productIds?: string[] }
 */
export declare const validateCouponController: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=coupon.controller.d.ts.map