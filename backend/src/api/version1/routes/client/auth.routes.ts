import express, { Router } from 'express';
import * as controller from "../../controllers/client/auth.controller"
import { limiter } from '../../../../middlewares/rateLimit.middlewares';
import { validate } from '../../../../middlewares/validate.middlewares'; 
import { registerSchema } from "../../validators/client/auth.validator"
import { loginSchema } from '../../validators/shared/loginSchema.validate';
import { loginShareController } from '../../controllers/shared/auth.shareController';
import User from '../../../../models/user.model';

const authRoutesClient: Router = express.Router()

authRoutesClient.post("/register", validate(registerSchema), controller.registerController)

authRoutesClient.post("/login", validate(loginSchema) ,limiter, loginShareController(User))

authRoutesClient.post("/refresh-token", controller.refreshController)

authRoutesClient.post("/logout", controller.logoutController)


export default authRoutesClient