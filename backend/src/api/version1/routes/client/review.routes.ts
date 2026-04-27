import express, {Router} from "express"
import * as controller from "../../controllers/client/review.controller"
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { upload, uploadToCloudinary } from "../../../../helpers/uploadToCloudinary";
import { validate } from "../../../../middlewares/validate.middlewares";
import { createReviewSchema } from "../../validators/client/review.validator";

const reviewRouter: Router = express.Router()

reviewRouter.post("/", verifyToken, upload.array("images", 5), validate(createReviewSchema), uploadToCloudinary, controller.createReviewProduct)
reviewRouter.get("/:productId", controller.getReviewsByProduct)

export default reviewRouter;