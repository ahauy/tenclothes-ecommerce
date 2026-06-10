import express, { Router } from "express";
import * as controller from "../../controllers/admin/review.controller";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";

const reviewRouterAdmin: Router = express.Router();

// Chỉ tài khoản có vai trò 'admin' mới được phép xem danh sách và thao tác duyệt review
reviewRouterAdmin.get("/", verifyToken, authorizationRole(["admin"]), controller.getReviewsAdmin);
reviewRouterAdmin.patch("/approve/:id", verifyToken, authorizationRole(["admin"]), controller.approveReviewAdmin);
reviewRouterAdmin.patch("/reject/:id", verifyToken, authorizationRole(["admin"]), controller.rejectReviewAdmin);
reviewRouterAdmin.post("/strike/:id", verifyToken, authorizationRole(["admin"]), controller.strikeUserAdmin);
reviewRouterAdmin.delete("/:id", verifyToken, authorizationRole(["admin"]), controller.deleteReviewAdmin);

export default reviewRouterAdmin;
