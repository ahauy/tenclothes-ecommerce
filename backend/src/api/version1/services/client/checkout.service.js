"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSuccessServiceClient = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const order_model_1 = require("../../../../models/order.model");
const checkoutSuccessServiceClient = async (orderId) => {
    const order = await order_model_1.Order.findById(orderId).lean();
    if (!order) {
        throw new ApiError_1.default(404, "Không tìm thấy thông tin đơn hàng!");
    }
    return order;
};
exports.checkoutSuccessServiceClient = checkoutSuccessServiceClient;
//# sourceMappingURL=checkout.service.js.map