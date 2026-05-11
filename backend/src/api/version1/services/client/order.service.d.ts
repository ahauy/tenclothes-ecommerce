import { IOrder } from "../../../../interfaces/model.interfaces";
import { IOrderReq } from "./../../validators/client/order.validator";
export declare const postOrderServiceClient: (payload: IOrderReq, userId?: string | null) => Promise<IOrder>;
export declare const updateOrderService: (orderId: string) => Promise<IOrder | null>;
export declare const getMyOrdersService: (userId: string) => Promise<IOrder[]>;
//# sourceMappingURL=order.service.d.ts.map