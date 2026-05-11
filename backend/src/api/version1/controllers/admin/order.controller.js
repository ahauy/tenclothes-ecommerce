"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDeleteOrderController = exports.deleteOrderAdminController = exports.batchUpdateOrderStatusController = exports.updateOrderStatusAdminController = exports.getOrderDetailAdminController = exports.getListOrderAdminController = exports.getOrderStatsAdminController = void 0;
const order_service_1 = require("../../services/admin/order.service");
const getOrderStatsAdminController = async (_req, res) => {
    try {
        const stats = await (0, order_service_1.getOrderStatsAdminService)();
        res.status(200).json({
            status: true,
            message: "Lấy thống kê đơn hàng thành công!",
            data: stats,
        });
    }
    catch (error) {
        console.error("Lỗi trong getOrderStatsAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getOrderStatsAdminController = getOrderStatsAdminController;
const getListOrderAdminController = async (req, res) => {
    try {
        const result = await (0, order_service_1.getListOrderAdminService)(req.query);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách đơn hàng thành công!",
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong getListOrderAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getListOrderAdminController = getListOrderAdminController;
const getOrderDetailAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await (0, order_service_1.getOrderDetailAdminService)(id);
        if (!order) {
            res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Lấy chi tiết đơn hàng thành công!",
            data: order,
        });
    }
    catch (error) {
        console.error("Lỗi trong getOrderDetailAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getOrderDetailAdminController = getOrderDetailAdminController;
const updateOrderStatusAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;
        const updateData = {};
        if (orderStatus !== undefined)
            updateData.orderStatus = orderStatus;
        if (paymentStatus !== undefined)
            updateData.paymentStatus = paymentStatus;
        const updatedOrder = await (0, order_service_1.updateOrderStatusAdminService)(id, updateData);
        if (!updatedOrder) {
            res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Cập nhật trạng thái đơn hàng thành công!",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error("Lỗi trong updateOrderStatusAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.updateOrderStatusAdminController = updateOrderStatusAdminController;
const batchUpdateOrderStatusController = async (req, res) => {
    try {
        const { orderIds, orderStatus, paymentStatus } = req.body;
        const updateData = {};
        if (orderStatus !== undefined)
            updateData.orderStatus = orderStatus;
        if (paymentStatus !== undefined)
            updateData.paymentStatus = paymentStatus;
        const result = await (0, order_service_1.batchUpdateOrderStatusService)(orderIds, updateData);
        res.status(200).json({
            status: true,
            message: `Đã cập nhật trạng thái ${result.updatedCount} đơn hàng thành công!`,
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong batchUpdateOrderStatusController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.batchUpdateOrderStatusController = batchUpdateOrderStatusController;
const deleteOrderAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await (0, order_service_1.deleteOrderAdminService)(id);
        if (!deletedOrder) {
            res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
            return;
        }
        res.status(200).json({
            status: true,
            message: "Xóa đơn hàng thành công!",
            data: deletedOrder,
        });
    }
    catch (error) {
        console.error("Lỗi trong deleteOrderAdminController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.deleteOrderAdminController = deleteOrderAdminController;
const batchDeleteOrderController = async (req, res) => {
    try {
        const { orderIds } = req.body;
        const result = await (0, order_service_1.batchDeleteOrderAdminService)(orderIds);
        res.status(200).json({
            status: true,
            message: `Đã xóa ${result.deletedCount} đơn hàng thành công!`,
            data: result,
        });
    }
    catch (error) {
        console.error("Lỗi trong batchDeleteOrderController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.batchDeleteOrderController = batchDeleteOrderController;
//# sourceMappingURL=order.controller.js.map