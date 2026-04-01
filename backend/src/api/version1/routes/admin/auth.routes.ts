import express, { Router } from "express";
import { validate } from "../../../../middlewares/validate.middlewares";
import { loginSchema } from "../../validators/shared/loginSchema.validate";
import { loginShareController } from "../../controllers/shared/auth.shareController";
import Account from "../../../../models/account.model";

const authRoutesAdmin: Router = express.Router()

authRoutesAdmin.post("/login", validate(loginSchema), loginShareController(Account))

export default authRoutesAdmin