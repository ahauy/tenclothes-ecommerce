import express, { Router } from "express"
import * as controller from "../../controllers/admin/product.controller"
import { verifyToken } from "../../../../middlewares/authen.middlewares"
import { authorizationRole } from "../../../../middlewares/authorize.middlewares"
import { validate } from "../../../../middlewares/validate.middlewares"
import { createProductSchema } from "../../validators/admin/product.validator"
import { upload, uploadToCloudinary } from "../../../../helpers/uploadToCloudinary"

const productRouter: Router = express.Router()

productRouter.post("/create", verifyToken, authorizationRole(['admin']), upload.array("media", 5), validate(createProductSchema), uploadToCloudinary, controller.createProductController)

export default productRouter