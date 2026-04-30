import express, { Router } from 'express';
import * as controller from "../../controllers/client/auth.controller"
// import { limiter } from '../../../../middlewares/rateLimit.middlewares';
import { validate } from '../../../../middlewares/validate.middlewares'; 
import { registerSchema } from "../../validators/client/auth.validator"
import { loginSchema } from '../../validators/shared/loginSchema.validate';
import { loginShareController, logoutShareController, refreshShareController } from '../../controllers/shared/auth.shareController';
import User from '../../../../models/user.model';

const authRoutesClient: Router = express.Router()

authRoutesClient.post("/register", validate(registerSchema), controller.registerController)

authRoutesClient.post("/login", validate(loginSchema), loginShareController(User))

authRoutesClient.post("/refresh-token", refreshShareController())

authRoutesClient.post("/logout", logoutShareController())


export default authRoutesClient