"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrdersClient = exports.momoIPN = exports.postOrderClient = void 0;
const order_service_1 = require("../../services/client/order.service");
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const axios_1 = __importDefault(require("axios"));
const product_model_1 = __importDefault(require("../../../../models/product.model"));
const sendMail_1 = require("../../../../helpers/sendMail");
const emailTemplate_1 = require("../../../../helpers/emailTemplate");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const coupon_model_1 = require("../../../../models/coupon.model");
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../../../../models/order.model");
const postOrderClient = async (req, res) => {
    try {
        const payload = req.body;
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decode = jsonwebtoken_1.default.verify(token, process.env["ACCESS_TOKEN_SECRET"]);
                userId = decode._id;
            }
            catch (err) {
                console.error("Token verification failed in postOrderClient:", err);
            }
        }
        const data = await (0, order_service_1.postOrderServiceClient)(payload, userId);
        const io = req.app.get("io");
        if (io) {
            io.emit("newOrder", data);
        }
        const paymentMethod = payload.customer.paymentMethod;
        if (paymentMethod === "cod") {
            res.status(201).json({
                status: true,
                message: "Đặt hàng thành công!",
                data: data,
            });
            const htmlContent = await (0, emailTemplate_1.emailTemplate)(data);
            // send mail for customer
            (0, sendMail_1.sendMail)(data.customer.email, `Xác nhận đơn hàng #${data.orderCode} - TenClothes Stores`, htmlContent).catch(error => {
                console.error(error);
            });
        }
        else if (paymentMethod === "momo") {
            //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
            //parameters
            let partnerCode = "MOMO";
            let accessKey = "F8BBA842ECF85";
            let secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            let requestId = partnerCode + new Date().getTime();
            // SỬA: Lấy ID đơn hàng thật trong MongoDB gán cho MoMo để dễ quản lý
            let orderId = data.orderCode.toString();
            let orderInfo = "Thanh toán đơn hàng - #" + data.orderCode;
            // SỬA: redirectUrl là link React của bạn để khách xem sau khi thanh toán
            // Giả sử React chạy ở port 5173
            let redirectUrl = "http://localhost:5173/momo-return";
            // SỬA: ipnUrl là link API Backend của bạn để MoMo gọi vào cập nhật trạng thái
            // Lưu ý: Môi trường local cần dùng Ngrok để public port (vd: https://abc.ngrok.io/api/version1/orders/momo-ipn)
            // Ví dụ link ngrok của bạn là https://abcd-123.ngrok-free.app
            let ipnUrl = "https://raven-urchin-apply.ngrok-free.dev/api/version1/orders/momo-ipn";
            // let ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            let amount = data.finalAmount;
            let requestType = "captureWallet";
            let extraData = ""; //pass empty value if your merchant does not have stores
            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            let rawSignature = "accessKey=" +
                accessKey +
                "&amount=" +
                amount +
                "&extraData=" +
                extraData +
                "&ipnUrl=" +
                ipnUrl +
                "&orderId=" +
                orderId +
                "&orderInfo=" +
                orderInfo +
                "&partnerCode=" +
                partnerCode +
                "&redirectUrl=" +
                redirectUrl +
                "&requestId=" +
                requestId +
                "&requestType=" +
                requestType;
            //signature
            const crypto = require("crypto");
            let signature = crypto
                .createHmac("sha256", secretkey)
                .update(rawSignature)
                .digest("hex");
            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                accessKey: accessKey,
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: redirectUrl,
                ipnUrl: ipnUrl,
                extraData: extraData,
                requestType: requestType,
                signature: signature,
                lang: "en",
            });
            const response = await axios_1.default.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            res.status(200).json({
                status: true,
                data: data,
                payUrl: response.data.payUrl,
            });
        }
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
exports.postOrderClient = postOrderClient;
const momoIPN = async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;
        if (resultCode === 0) {
            const updatedOrder = await (0, order_service_1.updateOrderService)(orderId);
            if (updatedOrder !== null) {
                // 1. Tiến hành trừ số lượng sản phẩm trong kho
                for (const item of updatedOrder.items) {
                    await product_model_1.default.updateOne({
                        _id: item.productId,
                        "variants.size": item.size,
                        "variants.colorName": item.color
                    }, {
                        $inc: { "variants.$.stock": -item.quantity, sold: item.quantity },
                    });
                }
                // 2. CHÍNH THỨC TRỪ LƯỢT DÙNG COUPON SAU KHI THANH TOÁN THÀNH CÔNG
                if (updatedOrder.couponCode) {
                    const updateQuery = { $inc: { usageCount: 1 } };
                    // Lưu ý: updatedOrder.userId có thể là string hoặc ObjectId, nên kiểm tra kĩ
                    if (updatedOrder.userId) {
                        updateQuery["$push"] = { usedBy: new mongoose_1.default.Types.ObjectId(updatedOrder.userId.toString()) };
                    }
                    await coupon_model_1.Coupon.findOneAndUpdate({ code: updatedOrder.couponCode }, updateQuery);
                }
                const htmlContent = await (0, emailTemplate_1.emailTemplate)(updatedOrder);
                await (0, sendMail_1.sendMail)(updatedOrder.customer.email, `Thanh toán thành công đơn hàng #${updatedOrder.orderCode}`, htmlContent);
            }
        }
        else {
            // NẾU KHÁCH HÀNG BẤM HỦY THANH TOÁN MOMO HOẶC LỖI THẺ
            // Đánh dấu đơn hàng là đã hủy để không bị treo và khách có thể dùng lại mã để đặt lại
            await order_model_1.Order.findOneAndUpdate({ orderCode: orderId }, { orderStatus: "cancelled", paymentStatus: "failed" });
        }
        res.status(200).json({ message: "Received IPN successfully" });
    }
    catch (error) {
        console.error("Lỗi khi xử lý MoMo IPN:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.momoIPN = momoIPN;
const getMyOrdersClient = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Không tìm thấy userId người dùng!" });
            return;
        }
        const orders = await (0, order_service_1.getMyOrdersService)(userId);
        res.status(200).json({
            status: true,
            message: "Lấy danh sách đơn hàng thành công!",
            data: orders,
        });
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng: ", error);
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
exports.getMyOrdersClient = getMyOrdersClient;
//# sourceMappingURL=order.controller.js.map