import express, { Router } from "express"
import * as controller from "../../controllers/client/order.controller"
import { validate } from "../../../../middlewares/validate.middlewares";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { orderSchema, cancelOrderSchema } from "../../validators/client/order.validator";

const orderRouterClient: Router = express.Router()

orderRouterClient.post("/", validate(orderSchema), controller.postOrderClient)

// IPN Webhook dành cho Server MoMo gọi vào
orderRouterClient.post("/momo-ipn", controller.momoIPN)

orderRouterClient.get("/my-orders", verifyToken, controller.getMyOrdersClient)

orderRouterClient.patch("/:orderCode/cancel", verifyToken, validate(cancelOrderSchema), controller.cancelOrderClient)

orderRouterClient.post("/:orderCode/repurchase", verifyToken, controller.repurchaseOrderClient)

export default orderRouterClient;