import { type Request, type Response } from "express";
import { IOrderReq } from "../../validators/client/order.validator";
export declare const postOrderClient: (req: Request<{}, {}, IOrderReq, {}>, res: Response) => Promise<void>;
export declare const momoIPN: (req: Request, res: Response) => Promise<void>;
export declare const getMyOrdersClient: (req: Request | any, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map