import express, { Router } from "express"
import * as controller from "../../controllers/client/category.controller"

const categoryRouter: Router = express.Router()

categoryRouter.get("/tree", controller.categoryTreeClient)

export default categoryRouter