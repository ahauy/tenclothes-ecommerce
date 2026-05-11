"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatsAdminService = exports.batchDeleteOrderAdminService = exports.deleteOrderAdminService = exports.batchUpdateOrderStatusService = exports.updateOrderStatusAdminService = exports.getOrderDetailAdminService = exports.getListOrderAdminService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../../../../models/order.model");
const getListOrderAdminService = async (queryFilter) => {
    const { page = "1", limit = "10", keyword, sort, startDate, endDate, orderStatus, paymentStatus } = queryFilter;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const filter = {};
    // Xử lý tìm kiếm keyword (Mã đơn hàng, Email, SĐT, Tên)
    if (keyword) {
        filter.$or = [
            { orderCode: { $regex: keyword, $options: "i" } },
            { "customer.fullName": { $regex: keyword, $options: "i" } },
            { "customer.email": { $regex: keyword, $options: "i" } },
            { "customer.phone": { $regex: keyword, $options: "i" } }
        ];
    }
    // Lọc theo trạng thái
    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }
    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }
    // Lọc theo ngày tạo
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
    }
    // Xử lý sắp xếp (Mặc định giảm dần theo ngày tạo)
    let sortOptions = { createdAt: -1 };
    if (sort) {
        if (sort.startsWith("-")) {
            sortOptions = { [sort.substring(1)]: -1 };
        }
        else {
            sortOptions = { [sort]: 1 };
        }
    }
    const [orders, totalElements] = await Promise.all([
        order_model_1.Order.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        order_model_1.Order.countDocuments(filter)
    ]);
    const totalPages = Math.ceil(totalElements / limitNum);
    return {
        content: orders,
        page: pageNum,
        limit: limitNum,
        totalElements,
        totalPages
    };
};
exports.getListOrderAdminService = getListOrderAdminService;
const getOrderDetailAdminService = async (orderId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
        return null;
    }
    const order = await order_model_1.Order.findById(orderId).populate("userId", "fullName email").lean();
    return order;
};
exports.getOrderDetailAdminService = getOrderDetailAdminService;
const updateOrderStatusAdminService = async (orderId, statusData) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
        return null;
    }
    const updatedOrder = await order_model_1.Order.findByIdAndUpdate(orderId, { $set: statusData }, { new: true }).lean();
    // (Optional) Xử lý lưu log lịch sử ở đây nếu dự án yêu cầu
    return updatedOrder;
};
exports.updateOrderStatusAdminService = updateOrderStatusAdminService;
const batchUpdateOrderStatusService = async (orderIds, statusData) => {
    const validIds = orderIds.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
        return { updatedCount: 0 };
    }
    const result = await order_model_1.Order.updateMany({ _id: { $in: validIds } }, { $set: statusData });
    return { updatedCount: result.modifiedCount };
};
exports.batchUpdateOrderStatusService = batchUpdateOrderStatusService;
const deleteOrderAdminService = async (orderId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
        return null;
    }
    const deletedOrder = await order_model_1.Order.findByIdAndDelete(orderId).lean();
    return deletedOrder;
};
exports.deleteOrderAdminService = deleteOrderAdminService;
const batchDeleteOrderAdminService = async (orderIds) => {
    const validIds = orderIds.filter(id => mongoose_1.default.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
        return { deletedCount: 0 };
    }
    const result = await order_model_1.Order.deleteMany({ _id: { $in: validIds } });
    return { deletedCount: result.deletedCount };
};
exports.batchDeleteOrderAdminService = batchDeleteOrderAdminService;
const getOrderStatsAdminService = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [globalAgg, todayAgg] = await Promise.all([
        order_model_1.Order.aggregate([
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: "$finalAmount" },
                                averageOrderValue: { $avg: "$finalAmount" },
                                totalItems: { $sum: { $size: "$items" } },
                            },
                        },
                    ],
                    byOrderStatus: [
                        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
                    ],
                    byPaymentStatus: [
                        {
                            $group: {
                                _id: "$paymentStatus",
                                count: { $sum: 1 },
                                revenue: { $sum: "$finalAmount" },
                            },
                        },
                    ],
                },
            },
        ]),
        order_model_1.Order.aggregate([
            { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
            {
                $group: {
                    _id: null,
                    todayOrders: { $sum: 1 },
                    todayRevenue: { $sum: "$finalAmount" },
                },
            },
        ]),
    ]);
    const totals = globalAgg[0]?.totals?.[0] ?? {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalItems: 0,
    };
    // Map order statuses
    const orderStatusMap = {};
    for (const item of globalAgg[0]?.byOrderStatus ?? []) {
        orderStatusMap[item._id] = item.count;
    }
    // Map payment statuses
    const paymentStatusMap = {};
    for (const item of globalAgg[0]?.byPaymentStatus ?? []) {
        paymentStatusMap[item._id] = { count: item.count, revenue: item.revenue };
    }
    const totalOrders = totals.totalOrders;
    const deliveredCount = orderStatusMap["delivered"] ?? 0;
    const cancelledCount = orderStatusMap["cancelled"] ?? 0;
    const paidRevenue = paymentStatusMap["paid"]?.revenue ?? 0;
    const unpaidRevenue = paymentStatusMap["unpaid"]?.revenue ?? 0;
    return {
        totalOrders,
        totalRevenue: totals.totalRevenue,
        averageOrderValue: Math.round(totals.averageOrderValue ?? 0),
        totalItems: totals.totalItems,
        pendingOrders: orderStatusMap["pending"] ?? 0,
        processingOrders: orderStatusMap["processing"] ?? 0,
        shippedOrders: orderStatusMap["shipped"] ?? 0,
        deliveredOrders: deliveredCount,
        cancelledOrders: cancelledCount,
        paidRevenue,
        unpaidRevenue,
        paidOrders: paymentStatusMap["paid"]?.count ?? 0,
        completionRate: totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0,
        cancellationRate: totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100) : 0,
        paymentRate: totalOrders > 0 ? Math.round(((paymentStatusMap["paid"]?.count ?? 0) / totalOrders) * 100) : 0,
        todayOrders: todayAgg[0]?.todayOrders ?? 0,
        todayRevenue: todayAgg[0]?.todayRevenue ?? 0,
    };
};
exports.getOrderStatsAdminService = getOrderStatsAdminService;
//# sourceMappingURL=order.service.js.map