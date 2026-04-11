import express, {Router} from "express"
import * as controller from "../../controllers/client/cart.controller"
import { verifyToken } from "../../../../middlewares/authen.middlewares"

const cartRouter: Router = express.Router()

cartRouter.post("/local-validate", controller.validateLocalCart)

cartRouter.post("/sync", verifyToken, controller.syncCart)

cartRouter.post("/add", verifyToken, controller.addToCart)

cartRouter.patch("/update", verifyToken, controller.updateCart)

cartRouter.patch("/remove", verifyToken, controller.removeFromCart)

export default cartRouter