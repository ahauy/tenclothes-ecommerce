import express, { Router } from "express";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";
import * as controller from "../../controllers/admin/user.controller"

const userRouter: Router = express.Router();

userRouter.use(verifyToken, authorizationRole(['admin', 'employee']))

userRouter.get("/", controller.getListUserAdminController)
userRouter.get("/:id", controller.getUserByIdAdminController)
userRouter.patch("/status/:id", controller.updateUserStatusAdminController)
userRouter.delete("/:id", controller.deleteUserAdminController)

export default userRouter
