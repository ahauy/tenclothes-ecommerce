import express, { Router } from "express"
import * as controller from "../../controllers/admin/product.controller"
import { verifyToken } from "../../../../middlewares/authen.middlewares"
import { authorizationRole } from "../../../../middlewares/authorize.middlewares"
import { validate } from "../../../../middlewares/validate.middlewares"
import { createProductSchema } from "../../validators/admin/product.validator"
// import { upload, uploadToCloudinary } from "../../../../helpers/uploadToCloudinary"

const productRouter: Router = express.Router()

productRouter.get("/", verifyToken, authorizationRole(['admin']), controller.getListProductAdminController)

productRouter.post("/create", verifyToken, authorizationRole(['admin']), validate(createProductSchema), controller.createProductController)

productRouter.patch("/update/:slug", verifyToken, authorizationRole(['admin']), validate(createProductSchema), controller.updateProductController)

productRouter.patch("/change-status/:slug", verifyToken, authorizationRole(['admin']), controller.changeStatusProductController)

productRouter.patch("/change-featured/:slug", verifyToken, authorizationRole(['admin']), controller.changeFeaturedProductController)

productRouter.delete("/delete/:slug", verifyToken, authorizationRole(['admin']), controller.deleteProductController)

export default productRouter