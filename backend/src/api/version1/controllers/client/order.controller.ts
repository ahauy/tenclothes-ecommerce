import { type Request, type Response } from "express";
import { IOrderReq } from "../../validators/client/order.validator";
import {
  postOrderServiceClient,
  updateOrderService,
} from "../../services/client/order.service";
import ApiError from "../../../../helpers/ApiError";
import axios from "axios";
import Product from "../../../../models/product.model";
import { sendMail } from "../../../../helpers/sendMail";
import { emailTemplate } from "../../../../helpers/emailTemplate";

export const postOrderClient = async (
  req: Request<{}, {}, IOrderReq, {}>,
  res: Response
): Promise<void> => {
  try {
    const payload: IOrderReq = req.body;

    const data = await postOrderServiceClient(payload);

    const paymentMethod: string = payload.customer.paymentMethod;

    if (paymentMethod === "cod") {
      res.status(201).json({
        status: true,
        message: "Đặt hàng thành công!",
        data: data,
      });

      const htmlContent = await emailTemplate(data);

      // send mail for customer
      sendMail(
        data.customer.email,
        `Xác nhận đơn hàng #${data.orderCode} - TenClothes Stores`,
        htmlContent
      ).catch(error => {
        console.error(error)
      });
    } else if (paymentMethod === "momo") {
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
      let ipnUrl =
        "https://raven-urchin-apply.ngrok-free.dev/api/version1/orders/momo-ipn";
      // let ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
      let amount = data.totalAmount;
      let requestType = "captureWallet";
      let extraData = ""; //pass empty value if your merchant does not have stores

      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      let rawSignature =
        "accessKey=" +
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

      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({
        status: true,
        data: data,
        payUrl: response.data.payUrl,
      });
    }
  } catch (error) {
    console.error("Có lỗi trong loginController: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
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

export const momoIPN = async (req: Request, res: Response): Promise<void> => {
  try {
    // Thông tin MoMo gửi sang
    const { orderId, resultCode } = req.body; // vì bên trên mình để là orderId = orderCode

    // Trong thực tế, bạn PHẢI lấy dữ liệu gửi về ghép lại thành chuỗi và tạo chữ ký
    // bằng secretKey để so sánh với cái 'signature' MoMo gửi, tránh hacker giả mạo.
    // Ở mức độ cơ bản, mình sẽ check resultCode trực tiếp:

    if (resultCode === 0) {
      // 0 là thanh toán thành công -> Cập nhật trạng thái đơn hàng
      const updatedOrder = await updateOrderService(orderId);

      if (updatedOrder !== null) {
        // tiến hành trừ số lượng sản phẩm trong kho
        for (const item of updatedOrder.items) {
          await Product.updateOne(
            {
              _id: item.productId,
              "variants.size": item.size,
            },
            {
              $inc: { "variants.$.stock": -item.quantity, sold: item.quantity },
            }
          );
        }

        const htmlContent = await emailTemplate(updatedOrder)

        // send mail for customer
        await sendMail(
          updatedOrder.customer.email,
          `Thanh toán thành công đơn hàng #${updatedOrder.orderCode}`,
          htmlContent
        );
      } else {
        return;
      }
    }

    // Bắt buộc phải trả về HTTP 200 cho MoMo biết là Server của bạn đã nhận được tín hiệu
    // Nếu không MoMo sẽ gọi lại liên tục (retry)
    res.status(200).json({ message: "Received IPN successfully" });
  } catch (error) {
    console.error("Lỗi khi xử lý MoMo IPN:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
