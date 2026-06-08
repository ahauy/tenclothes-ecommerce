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
import { Cart } from "../../../../models/cart.model";

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

  // ── XÓA GIỎ HÀNG TRÊN DATABASE NẾU NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ──
  if (userId) {
    await Cart.updateOne({ userId: userId }, { $set: { items: [] } });
  }

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
  const orders = await Order.find({
    userId: userId,
    $or: [
      { "customer.paymentMethod": { $ne: "momo" } },
      { paymentStatus: { $in: ["paid", "refunded"] } }
    ]
  }).sort({ createdAt: -1 }).lean();
  
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

export const cancelOrderServiceClient = async (
  orderCode: string,
  userId: string,
  cancelReason: string
): Promise<IOrder> => {
  const order = await Order.findOne({ orderCode: orderCode.toUpperCase(), userId: userId });
  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng!");
  }

  // Chỉ cho phép hủy đơn ở trạng thái pending hoặc processing
  if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
    throw new ApiError(
      400,
      `Đơn hàng ở trạng thái "${order.orderStatus}" không thể hủy!`
    );
  }

  const oldPaymentStatus = order.paymentStatus;

  // Cập nhật trạng thái đơn hàng
  order.orderStatus = "cancelled";
  order.cancelReason = cancelReason;

  // Nếu đã thanh toán thì cập nhật trạng thái là refunded
  if (oldPaymentStatus === "paid") {
    order.paymentStatus = "refunded";
  }

  await order.save();

  // Hoàn lại kho nếu kho đã bị trừ trước đó.
  // Kho bị trừ khi:
  // 1. Phương thức thanh toán là COD
  // 2. Phương thức thanh toán là Momo và trạng thái thanh toán đã là paid trước khi hủy
  const wasStockDecremented =
    order.customer.paymentMethod === "cod" ||
    (order.customer.paymentMethod === "momo" && oldPaymentStatus === "paid");

  if (wasStockDecremented) {
    // 1. Hoàn trả kho sản phẩm
    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.size,
          "variants.colorName": item.color
        },
        {
          $inc: { "variants.$.stock": item.quantity, sold: -item.quantity },
        }
      );
    }

    // 2. Hoàn lại lượt sử dụng mã giảm giá (nếu có)
    if (order.couponCode) {
      const updateQuery: any = { $inc: { usageCount: -1 } };
      if (order.userId) {
        updateQuery["$pull"] = { usedBy: new mongoose.Types.ObjectId(order.userId.toString()) };
      }
      await Coupon.findOneAndUpdate({ code: order.couponCode }, updateQuery);
    }
  }

  return order;
};

export const repurchaseOrderServiceClient = async (
  orderCode: string,
  userId: string
): Promise<any> => {
  const order = await Order.findOne({ orderCode: orderCode.toUpperCase(), userId: userId });
  if (!order) {
    throw new ApiError(404, "Không tìm thấy đơn hàng!");
  }

  // Chỉ lấy những sản phẩm còn bán (isActive: true và deleted: false)
  const productIds = order.items.map((item) => item.productId);
  const activeProducts = await Product.find({
    _id: { $in: productIds },
    isActive: { $ne: false },
    deleted: { $ne: true },
  }).select("_id").lean();

  const activeProductIdsSet = new Set(activeProducts.map((p) => p._id.toString()));

  const validItems = order.items.filter((item) =>
    activeProductIdsSet.has(item.productId.toString())
  );

  if (validItems.length === 0) {
    throw new ApiError(
      400,
      "Tất cả sản phẩm trong đơn hàng này hiện đã ngừng bán hoặc không còn tồn tại!"
    );
  }

  // Lấy hoặc tạo mới giỏ hàng của user
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Thêm từng sản phẩm hợp lệ vào giỏ hàng
  for (const item of validItems) {
    const existingIndex = cart.items.findIndex(
      (cartItem) =>
        String(cartItem.productId) === String(item.productId) &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex]!.quantity += item.quantity;
    } else {
      cart.items.push({
        productId: item.productId,
        sku: item.sku,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      } as any);
    }
  }

  await cart.save();
  return cart;
};