import express, { Router } from "express"
import * as controller from "../../controllers/client/order.controller"
import { validate } from "../../../../middlewares/validate.middlewares";
import { orderSchema } from "../../validators/client/order.validator";

const orderRouterClient: Router = express.Router()

orderRouterClient.post("/", validate(orderSchema), controller.postOrderClient)

// IPN Webhook dành cho Server MoMo gọi vào
orderRouterClient.post("/momo-ipn", controller.momoIPN)

export default orderRouterClient;