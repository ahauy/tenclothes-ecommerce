import express, { Router } from "express";
import { validate } from "../../../../middlewares/validate.middlewares";
import { loginSchema } from "../../validators/shared/loginSchema.validate";
import { loginShareController, logoutShareController, refreshShareController } from "../../controllers/shared/auth.shareController";
import Account from "../../../../models/account.model";

const authRoutesAdmin: Router = express.Router()

authRoutesAdmin.post("/login", validate(loginSchema), loginShareController(Account, "admin_jwt"))

authRoutesAdmin.post("/refresh-token", refreshShareController("admin_jwt"))

authRoutesAdmin.post("/logout", logoutShareController("admin_jwt"))

export default authRoutesAdmin