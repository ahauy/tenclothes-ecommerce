import express, { Router } from "express";
import * as controller from "../../controllers/client/checkout.controller"

const checkoutRouter: Router = express.Router();

checkoutRouter.get(`/success/:id`, controller.checkoutSuccessControllerClient)

export default checkoutRouter;