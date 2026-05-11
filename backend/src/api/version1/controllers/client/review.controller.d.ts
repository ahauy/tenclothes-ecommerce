import { Request, Response } from "express";
import { CreateReviewReqBody } from "../../validators/client/review.validator";
export declare const createReviewProduct: (req: Request<{}, {}, CreateReviewReqBody>, res: Response) => Promise<void>;
export declare const getReviewsByProduct: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=review.controller.d.ts.map