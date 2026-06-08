import express, { Router } from "express";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";
import * as controller from "../../controllers/admin/user.controller"

const userRouter: Router = express.Router();

userRouter.use(verifyToken, authorizationRole(['admin', 'employee']))

userRouter.get("/", controller.getListUserAdminController)

export default userRouter
