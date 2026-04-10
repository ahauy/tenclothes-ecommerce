import { Request, Response } from "express";
import ApiError from "../../../../helpers/ApiError";
import { checkoutSuccessServiceClient } from "../../services/client/checkout.service";

export const checkoutSuccessControllerClient = async (
  req: Request<{id: string}>,
  res: Response
) => {
  try {
    const orderId: string = req.params['id']

    const data = await checkoutSuccessServiceClient(orderId)

    res.status(200).json({
      status: true,
      message: "Lấy thông tin đơn hàng thành công!",
      data: data
    })
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
