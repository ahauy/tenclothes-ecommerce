import { Request, Response } from "express";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import {
  getListOrderAdminService,
  getOrderDetailAdminService,
  updateOrderStatusAdminService,
  batchUpdateOrderStatusService,
  deleteOrderAdminService,
  batchDeleteOrderAdminService,
  getOrderStatsAdminService
} from "../../services/admin/order.service";

export const getOrderStatsAdminController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getOrderStatsAdminService();
    res.status(200).json({
      status: true,
      message: "Lấy thống kê đơn hàng thành công!",
      data: stats,
    });
  } catch (error) {
    console.error("Lỗi trong getOrderStatsAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const getListOrderAdminController = async (
  req: Request<{}, {}, {}, IRequestQueryFilter>,
  res: Response
): Promise<void> => {
  try {
    const result = await getListOrderAdminService(req.query);

    res.status(200).json({
      status: true,
      message: "Lấy danh sách đơn hàng thành công!",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi trong getListOrderAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const getOrderDetailAdminController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const order = await getOrderDetailAdminService(id);

    if (!order) {
      res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Lấy chi tiết đơn hàng thành công!",
      data: order,
    });
  } catch (error) {
    console.error("Lỗi trong getOrderDetailAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const updateOrderStatusAdminController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { orderStatus, paymentStatus } = req.body;

    const updateData: { orderStatus?: string; paymentStatus?: string } = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    const updatedOrder = await updateOrderStatusAdminService(
      id, 
      updateData
    );

    if (!updatedOrder) {
      res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi trong updateOrderStatusAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const batchUpdateOrderStatusController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { orderIds, orderStatus, paymentStatus } = req.body as { 
      orderIds: string[]; 
      orderStatus?: string; 
      paymentStatus?: string; 
    };

    const updateData: { orderStatus?: string; paymentStatus?: string } = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    const result = await batchUpdateOrderStatusService(
      orderIds, 
      updateData
    );

    res.status(200).json({
      status: true,
      message: `Đã cập nhật trạng thái ${result.updatedCount} đơn hàng thành công!`,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi trong batchUpdateOrderStatusController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const deleteOrderAdminController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    
    const deletedOrder = await deleteOrderAdminService(id);

    if (!deletedOrder) {
      res.status(404).json({ status: false, message: "Không tìm thấy đơn hàng!" });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Xóa đơn hàng thành công!",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Lỗi trong deleteOrderAdminController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

export const batchDeleteOrderController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { orderIds } = req.body as { orderIds: string[] };

    const result = await batchDeleteOrderAdminService(orderIds);

    res.status(200).json({
      status: true,
      message: `Đã xóa ${result.deletedCount} đơn hàng thành công!`,
      data: result,
    });
  } catch (error) {
    console.error("Lỗi trong batchDeleteOrderController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
