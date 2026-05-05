import express, { Router } from "express"
import * as controller from "../../controllers/admin/order.controller"
import { verifyToken } from "../../../../middlewares/authen.middlewares"
import { authorizationRole } from "../../../../middlewares/authorize.middlewares"
import { validate } from "../../../../middlewares/validate.middlewares"
import { updateOrderStatusSchema, batchUpdateOrderStatusSchema, batchDeleteOrderSchema } from "../../validators/admin/order.validator"

const orderRouter: Router = express.Router()

// Lấy thống kê đơn hàng tổng hợp
orderRouter.get("/stats", verifyToken, authorizationRole(['admin', 'employee']), controller.getOrderStatsAdminController)

// Lấy danh sách đơn hàng
orderRouter.get("/", verifyToken, authorizationRole(['admin', 'employee']), controller.getListOrderAdminController)

// Lấy chi tiết đơn hàng
orderRouter.get("/:id", verifyToken, authorizationRole(['admin', 'employee']), controller.getOrderDetailAdminController)

// Cập nhật trạng thái một đơn hàng
orderRouter.patch(
  "/:id/status", 
  verifyToken, 
  authorizationRole(['admin']), 
  validate(updateOrderStatusSchema), 
  controller.updateOrderStatusAdminController
)

// Cập nhật trạng thái hàng loạt
orderRouter.patch(
  "/batch/status", 
  verifyToken, 
  authorizationRole(['admin']), 
  validate(batchUpdateOrderStatusSchema), 
  controller.batchUpdateOrderStatusController
)

// Xóa hàng loạt đơn hàng
orderRouter.delete(
  "/batch", 
  verifyToken, 
  authorizationRole(['admin']), 
  validate(batchDeleteOrderSchema), 
  controller.batchDeleteOrderController
)

// Xóa một đơn hàng
orderRouter.delete(
  "/:id", 
  verifyToken, 
  authorizationRole(['admin']), 
  controller.deleteOrderAdminController
)

export default orderRouter