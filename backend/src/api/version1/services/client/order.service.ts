import ApiError from "../../../../helpers/ApiError";
import { randomCode } from "../../../../helpers/randomCode";
import {
  IOrder,
  IOrderProductItem,
  IProduct,
} from "../../../../interfaces/model.interfaces";
import { Order } from "../../../../models/order.model";
import Product from "../../../../models/product.model";
import { IOrderReq } from "./../../validators/client/order.validator";

export const postOrderServiceClient = async (
  payload: IOrderReq
): Promise<IOrder> => {
  const { customer, items } = payload;

  let totalAmount: number = 0;
  const orderItems: IOrderProductItem[] = [];

  for (const item of items) {
    const product: IProduct | null = await Product.findById(item.productId);

    if (!product) {
      throw new ApiError(
        404,
        `Sản phẩm có ID: ${item.productId} không tồn tại hoặc đã bị xóa!`
      );
    }

    totalAmount += product.salePrice * item.quantity;

    orderItems.push({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      size: item.size,
      image: product.media[0]!,
      quantity: item.quantity,
    });
  }

  const newOrder = new Order({
    orderCode: randomCode(8),
    customer: customer,
    items: orderItems,
    totalAmount: totalAmount,
    orderStatus: "pending",
    paymentStatus: "unpaid",
  });

  const saveOrder = await newOrder.save();

  if (customer.paymentMethod === "cod") {
    for (const item of items) {
      await Product.updateOne(
        {
          _id: item.productId,
          "variants.size": item.size,
        },
        {
          $inc: { "variants.$.stock": -item.quantity, sold: item.quantity },
        }
      );
    }
  }

  return saveOrder;
};

export const updateOrderService = async (
  orderId: string
): Promise<IOrder | null> => {
  const updatedOrder = await Order.findOneAndUpdate(
    {
      orderCode: orderId,
    },
    {
      paymentStatus: "paid",
      orderStatus: "processing",
    },
    {
      new: true,
    }
  );
  return updatedOrder;
};
