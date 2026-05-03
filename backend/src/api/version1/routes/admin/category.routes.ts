import express, { Router } from "express"
import * as controller from "../../controllers/admin/category.controller"

const categoryRouter: Router = express.Router()

categoryRouter.get("/", controller.categoryTreeAdmin)

export default categoryRouter
