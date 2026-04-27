import ApiError from "../../../../helpers/ApiError";
import { randomCode } from "../../../../helpers/randomCode";
import { IOrder, IOrderProductItem, IProduct } from "../../../../interfaces/model.interfaces";
import { Order } from "../../../../models/order.model";
import Product from "../../../../models/product.model";
import Review from "../../../../models/review.model";
import { IOrderReq } from "./../../validators/client/order.validator";

export const postOrderServiceClient = async (payload: IOrderReq, userId: string | null = null): Promise<IOrder> => {
  const { customer, items } = payload;
  let totalAmount: number = 0;
  const orderItems: IOrderProductItem[] = [];

  for (const item of items) {
    const product = await Product.findById(item.productId) as IProduct | null;
    if (!product) {
      throw new ApiError(404, `Sản phẩm có ID: ${item.productId} không tồn tại hoặc đã bị xóa!`);
    }

    // Lấy đúng hình ảnh của màu đó để lưu vào hóa đơn
    const style = product.productStyles?.find(s => s.colorName === item.color) || product.productStyles?.[0];

    totalAmount += product.salePrice * item.quantity;

    orderItems.push({
      productId: product._id,
      sku: item.sku,
      slug: product.slug,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      color: item.color,
      size: item.size,
      image: style?.images[0] || "",
      quantity: item.quantity,
    });
  }

  const newOrder = new Order({
    userId: userId,
    orderCode: randomCode(8),
    customer: customer,
    items: orderItems,
    totalAmount: totalAmount,
    orderStatus: "pending",
    paymentStatus: "unpaid",
  });

  const saveOrder = await newOrder.save();

  // Trừ kho nếu là COD
  if (customer.paymentMethod === "cod") {
    for (const item of items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.size,
          "variants.colorName": item.color // QUAN TRỌNG: Phải khớp màu mới trừ đúng biến thể
        },
        {
          $inc: { "variants.$.stock": -item.quantity, sold: item.quantity },
        }
      );
    }
  }

  return saveOrder;
};

export const updateOrderService = async (orderId: string): Promise<IOrder | null> => {
  const updatedOrder = await Order.findOneAndUpdate(
    { orderCode: orderId },
    { paymentStatus: "paid", orderStatus: "processing" },
    { new: true }
  );
  return updatedOrder;
};

export const getMyOrdersService = async (userId: string): Promise<IOrder[]> => {
  const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
  
  // Find all reviews by this user to check which items have been reviewed
  const userReviews = await Review.find({ userId: userId }).select("orderId productId").lean();
  const reviewedSet = new Set(userReviews.map(r => `${r.orderId.toString()}-${r.productId.toString()}`));

  // Attach isReviewed to each item
  const ordersWithReviewStatus = orders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      isReviewed: reviewedSet.has(`${order._id.toString()}-${item.productId.toString()}`)
    }))
  }));

  return ordersWithReviewStatus as any;
};