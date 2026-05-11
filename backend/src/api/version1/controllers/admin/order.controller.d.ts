import { Request, Response } from "express";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
export declare const getOrderStatsAdminController: (_req: Request, res: Response) => Promise<void>;
export declare const getListOrderAdminController: (req: Request<{}, {}, {}, IRequestQueryFilter>, res: Response) => Promise<void>;
export declare const getOrderDetailAdminController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const updateOrderStatusAdminController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const batchUpdateOrderStatusController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const deleteOrderAdminController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const batchDeleteOrderController: (req: IAuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map