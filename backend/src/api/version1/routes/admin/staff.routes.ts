import express, { Router } from "express";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";
import { validate } from "../../../../middlewares/validate.middlewares";
import {
  createStaffSchema,
  updateStaffSchema,
  getStaffsQuerySchema,
} from "../../validators/admin/staff.validator";
import * as controller from "../../controllers/admin/staff.controller";

const staffRouter: Router = express.Router();

staffRouter.get(
  "/",
  verifyToken,
  authorizationRole(["admin", "employee"]),
  validate(getStaffsQuerySchema),
  controller.getListStaffsController
);

staffRouter.post(
  "/create",
  verifyToken,
  authorizationRole(["admin"]),
  validate(createStaffSchema),
  controller.createStaffController
);

staffRouter.patch(
  "/:id",
  verifyToken,
  authorizationRole(["admin"]),
  validate(updateStaffSchema),
  controller.updateStaffController
);

staffRouter.delete(
  "/:id",
  verifyToken,
  authorizationRole(["admin"]),
  controller.deleteStaffController
);

export default staffRouter;
