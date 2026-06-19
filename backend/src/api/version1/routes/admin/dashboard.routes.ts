import express, { Router } from "express";
import * as controller from "../../controllers/admin/dashboard.controller";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";
import { validate } from "../../../../middlewares/validate.middlewares";
import { getDashboardQuerySchema } from "../../validators/admin/dashboard.validator";

const dashboardRouter: Router = express.Router();

// Lấy thống kê số liệu dashboard
dashboardRouter.get(
  "/stats",
  verifyToken,
  authorizationRole(["admin", "employee"]),
  validate(getDashboardQuerySchema),
  controller.getDashboardStatsAdminController
);

// Xuất báo cáo tài chính Excel
dashboardRouter.get(
  "/export",
  verifyToken,
  authorizationRole(["admin", "employee"]),
  validate(getDashboardQuerySchema),
  controller.exportFinancialReportController
);

export default dashboardRouter;
