import mongoose from "mongoose";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
export declare const getListOrderAdminService: (queryFilter: IRequestQueryFilter) => Promise<{
    content: (import("../../../../interfaces/model.interfaces").IOrder & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[];
    page: number;
    limit: number;
    totalElements: number;
    totalPages: number;
}>;
export declare const getOrderDetailAdminService: (orderId: string) => Promise<(import("../../../../interfaces/model.interfaces").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const updateOrderStatusAdminService: (orderId: string, statusData: {
    orderStatus?: string;
    paymentStatus?: string;
}) => Promise<(import("../../../../interfaces/model.interfaces").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const batchUpdateOrderStatusService: (orderIds: string[], statusData: {
    orderStatus?: string;
    paymentStatus?: string;
}) => Promise<{
    updatedCount: number;
}>;
export declare const deleteOrderAdminService: (orderId: string) => Promise<(import("../../../../interfaces/model.interfaces").IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const batchDeleteOrderAdminService: (orderIds: string[]) => Promise<{
    deletedCount: number;
}>;
export declare const getOrderStatsAdminService: () => Promise<{
    totalOrders: any;
    totalRevenue: any;
    averageOrderValue: number;
    totalItems: any;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    paidRevenue: number;
    unpaidRevenue: number;
    paidOrders: number;
    completionRate: number;
    cancellationRate: number;
    paymentRate: number;
    todayOrders: any;
    todayRevenue: any;
}>;
//# sourceMappingURL=order.service.d.ts.map