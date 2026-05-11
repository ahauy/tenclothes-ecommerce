"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = __importDefault(require("./ApiError"));
const sendMail = async (email, subject, html) => {
    // Cấu hình transporter (sử dụng Gmail làm ví dụ)
    const transporter = nodemailer_1.default.createTransport({
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
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new ApiError_1.default(421, "Có lỗi trong quá trình gửi mail!");
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map