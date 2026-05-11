"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSuccessControllerClient = void 0;
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const checkout_service_1 = require("../../services/client/checkout.service");
const checkoutSuccessControllerClient = async (req, res) => {
    try {
        const orderId = req.params['id'];
        const data = await (0, checkout_service_1.checkoutSuccessServiceClient)(orderId);
        res.status(200).json({
            status: true,
            message: "Lấy thông tin đơn hàng thành công!",
            data: data
        });
    }
    catch (error) {
        console.error("Có lỗi trong loginController: ", error);
        // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({
                status: false,
                message: error.message, // Sẽ in ra "Email đã được sử dụng!"
            });
            return;
        }
        // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.checkoutSuccessControllerClient = checkoutSuccessControllerClient;
//# sourceMappingURL=checkout.controller.js.map