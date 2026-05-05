import mongoose from "mongoose";
import ApiError from "../../../../helpers/ApiError";
import { randomCode } from "../../../../helpers/randomCode";
import { IOrder, IOrderProductItem, IProduct } from "../../../../interfaces/model.interfaces";
import { Order } from "../../../../models/order.model";
import Product from "../../../../models/product.model";
import Review from "../../../../models/review.model";
import { Coupon } from "../../../../models/coupon.model";
import { validateCouponService } from "./coupon.service";
import { IOrderReq } from "./../../validators/client/order.validator";

export const postOrderServiceClient = async (payload: IOrderReq, userId: string | null = null): Promise<IOrder> => {
  const { customer, items, couponCode } = payload;
  let totalAmount: number = 0;
  const orderItems: IOrderProductItem[] = [];
  const productIds: string[] = [];

  for (const item of items) {
    const product = await Product.findById(item.productId) as IProduct | null;
    if (!product) {
      throw new ApiError(404, `Sản phẩm có ID: ${item.productId} không tồn tại hoặc đã bị xóa!`);
    }

    const style = product.productStyles?.find(s => s.colorName === item.color) || product.productStyles?.[0];

    totalAmount += product.salePrice * item.quantity;
    productIds.push(product._id.toString());

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

  // ── Áp dụng coupon (nếu có) ──
  let discountAmount = 0;
  let finalAmount = totalAmount;
  let appliedCouponCode: string | null = null;

  if (couponCode && couponCode.trim()) {
    // Validate lại lần 2 để chống race condition
    const couponResult = await validateCouponService(couponCode, userId, totalAmount, productIds);
    discountAmount = couponResult.discountAmount;
    finalAmount = couponResult.finalAmount;
    appliedCouponCode = couponResult.coupon.code;
  }

  // ── Tạo đơn hàng ──
  const newOrder = new Order({
    userId: userId,
    orderCode: randomCode(8),
    customer: customer,
    items: orderItems,
    totalAmount: totalAmount,
    discountAmount: discountAmount,
    finalAmount: finalAmount,
    couponCode: appliedCouponCode,
    orderStatus: "pending",
    paymentStatus: "unpaid",
  });

  const saveOrder = await newOrder.save();

  // ── CHỈ TRỪ KHO VÀ COUPON NẾU THANH TOÁN LÀ COD ──
  // (Nếu là MoMo, sẽ chờ webhook IPN xác nhận mới trừ để tránh mất lượt của khách)
  if (customer.paymentMethod === "cod") {
    
    // 1. Trừ lượt sử dụng mã giảm giá
    if (appliedCouponCode) {
      const updateQuery: any = { $inc: { usageCount: 1 } };
      if (userId) {
        updateQuery["$push"] = { usedBy: new mongoose.Types.ObjectId(userId) };
      }
      await Coupon.findOneAndUpdate({ code: appliedCouponCode }, updateQuery);
    }

    // 2. Trừ kho
    for (const item of items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.size,
          "variants.colorName": item.color
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
    { returnDocument: "after" }
  );
  return updatedOrder;
};

export const getMyOrdersService = async (userId: string): Promise<IOrder[]> => {
  const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();
  
  const userReviews = await Review.find({ userId: userId }).select("orderId productId").lean();
  const reviewedSet = new Set(userReviews.map(r => `${r.orderId.toString()}-${r.productId.toString()}`));

  const ordersWithReviewStatus = orders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      isReviewed: reviewedSet.has(`${order._id.toString()}-${item.productId.toString()}`)
    }))
  }));

  return ordersWithReviewStatus as any;
};