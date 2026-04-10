import nodemailer from "nodemailer";
import ApiError from "./ApiError";

export const sendMail = async (
  email: string,
  subject: string,
  html: string
): Promise<void> => {
  // Cấu hình transporter (sử dụng Gmail làm ví dụ)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env["EMAIL_USER"], // Email của shop
      pass: process.env["EMAIL_PASS"], // Mật khẩu ứng dụng (App Password)
    },
  });

  const mailOptions = {
    from: `"TenClothes Store" <${process.env["EMAIL_USER"]}>`,
    to: email,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new ApiError(421, "Có lỗi trong quá trình gửi mail!")
  }
};
