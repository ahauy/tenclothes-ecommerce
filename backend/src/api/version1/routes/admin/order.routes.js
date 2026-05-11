"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller = __importStar(require("../../controllers/admin/order.controller"));
const authen_middlewares_1 = require("../../../../middlewares/authen.middlewares");
const authorize_middlewares_1 = require("../../../../middlewares/authorize.middlewares");
const validate_middlewares_1 = require("../../../../middlewares/validate.middlewares");
const order_validator_1 = require("../../validators/admin/order.validator");
const orderRouter = express_1.default.Router();
// Lấy thống kê đơn hàng tổng hợp
orderRouter.get("/stats", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin', 'employee']), controller.getOrderStatsAdminController);
// Lấy danh sách đơn hàng
orderRouter.get("/", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin', 'employee']), controller.getListOrderAdminController);
// Lấy chi tiết đơn hàng
orderRouter.get("/:id", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin', 'employee']), controller.getOrderDetailAdminController);
// Cập nhật trạng thái một đơn hàng
orderRouter.patch("/:id/status", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), (0, validate_middlewares_1.validate)(order_validator_1.updateOrderStatusSchema), controller.updateOrderStatusAdminController);
// Cập nhật trạng thái hàng loạt
orderRouter.patch("/batch/status", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), (0, validate_middlewares_1.validate)(order_validator_1.batchUpdateOrderStatusSchema), controller.batchUpdateOrderStatusController);
// Xóa hàng loạt đơn hàng
orderRouter.delete("/batch", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), (0, validate_middlewares_1.validate)(order_validator_1.batchDeleteOrderSchema), controller.batchDeleteOrderController);
// Xóa một đơn hàng
orderRouter.delete("/:id", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.deleteOrderAdminController);
exports.default = orderRouter;
//# sourceMappingURL=order.routes.js.map