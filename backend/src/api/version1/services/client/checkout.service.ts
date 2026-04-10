import ApiError from "../../../../helpers/ApiError"
import { Order } from "../../../../models/order.model"

export const checkoutSuccessServiceClient = async (orderId: string) => {
  const order = await Order.findById(orderId).lean()

  if(!order) {
    throw new ApiError(404, "Không tìm thấy thông tin đơn hàng!")
  }

  return order
}