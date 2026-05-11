"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplate = void 0;
const axios_1 = __importDefault(require("axios"));
// Hàm format tiền tệ
const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
};
const emailTemplate = async (order) => {
    // Lấy các giá trị tính toán đã lưu trên Backend
    const totalProductValue = order.totalAmount || 0;
    const discountAmount = order.discountAmount || 0;
    const finalAmount = order.finalAmount || order.totalAmount;
    const couponCode = order.couponCode || null;
    const deliveryFee = 0; // Giả sử freeship
    // 1. Lấy tên Tỉnh/Huyện/Xã từ mã code
    let fullAddress = "";
    try {
        const [pRes, dRes, wRes] = await Promise.all([
            axios_1.default.get(`https://provinces.open-api.vn/api/p/${order.customer.province}`),
            axios_1.default.get(`https://provinces.open-api.vn/api/d/${order.customer.district}`),
            axios_1.default.get(`https://provinces.open-api.vn/api/w/${order.customer.ward}`),
        ]);
        const provinceName = pRes.data.name;
        const districtName = dRes.data.name;
        const wardName = wRes.data.name;
        fullAddress = `${order.customer.detailAddress}, ${wardName}, ${districtName}, ${provinceName}`;
    }
    catch (error) {
        fullAddress = `${order.customer.detailAddress}, Mã xã: ${order.customer.ward}, Mã huyện: ${order.customer.district}, Mã tỉnh: ${order.customer.province}`;
    }
    // Render danh sách sản phẩm
    const itemsHtml = order.items
        .map((item) => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="70" style="vertical-align: top;">
              <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; background-color: #f3f4f6; display: block;" />
            </td>
            <td style="vertical-align: top; padding-left: 10px;">
              <p style="margin: 0 0 5px 0; font-weight: 600; font-size: 14px; color: #333; line-height: 1.4;">${item.title}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Size: <strong>${item.size}</strong></p>
              <p style="margin: 0; font-size: 12px; color: #666;">Color: <strong>${item.color}</strong></p>
            </td>
          </tr>
        </table>
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee; text-align: center; font-size: 14px; color: #333;">${item.quantity}</td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-size: 14px; font-weight: bold; color: #dc2626;">${formatPrice(item.salePrice * item.quantity)}đ</td>
    </tr>
  `)
        .join("");
    // Chuỗi HTML cho dòng mã giảm giá (chỉ hiện khi có dùng mã)
    const discountHtmlRow = discountAmount > 0 ? `
    <tr>
      <td style="padding: 8px 10px; color: #666666; font-size: 14px;">Voucher giảm giá ${couponCode ? `(<strong>${couponCode}</strong>)` : ''}</td>
      <td style="padding: 8px 10px; text-align: right; font-size: 14px; font-weight: 600; color: #059669;">-${formatPrice(discountAmount)}đ</td>
    </tr>
  ` : '';
    const paymentMethodText = order.customer.paymentMethod === "cod"
        ? "Thanh toán khi nhận hàng (COD)"
        : "Thanh toán qua MoMo";
    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; padding: 20px; color: #333333; line-height: 1.6;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: 800; text-transform: uppercase; color: #000000; margin-bottom: 10px; letter-spacing: -0.5px;">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p style="font-size: 14px; color: #555555; margin: 0;">
          Cảm ơn bạn đã lựa chọn mua sắm tại <strong>TenClothes Store</strong>.<br/>
          Đơn hàng <strong>#${order.orderCode}</strong> của bạn đã được tiếp nhận và đang được xử lý.
        </p>
      </div>

      <h2 style="font-size: 18px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">Thông tin đơn hàng</h2>
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="background-color: #1a1a1a; color: #ffffff; padding: 12px 10px; text-align: left; font-size: 13px; font-weight: 600;">SẢN PHẨM</th>
            <th style="background-color: #1a1a1a; color: #ffffff; padding: 12px 10px; text-align: center; font-size: 13px; font-weight: 600; width: 60px;">SL</th>
            <th style="background-color: #1a1a1a; color: #ffffff; padding: 12px 10px; text-align: right; font-size: 13px; font-weight: 600; width: 100px;">THÀNH TIỀN</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
        <tr>
          <td style="padding: 8px 10px; color: #666666; font-size: 14px;">Tổng giá trị sản phẩm</td>
          <td style="padding: 8px 10px; text-align: right; font-size: 14px; font-weight: 600;">${formatPrice(totalProductValue)}đ</td>
        </tr>
        ${discountHtmlRow}
        <tr>
          <td style="padding: 8px 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Phí giao hàng</td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-size: 14px; font-weight: 600;">${formatPrice(deliveryFee)}đ</td>
        </tr>
        <tr>
          <td style="background-color: #000000; color: #ffffff; padding: 15px 10px; font-size: 16px; font-weight: 700; text-transform: uppercase;">Tổng thanh toán</td>
          <td style="background-color: #000000; color: #facc15; padding: 15px 10px; text-align: right; font-size: 18px; font-weight: 800;">${formatPrice(finalAmount)}đ</td>
        </tr>
      </table>

      <h2 style="font-size: 18px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px;">Thông tin nhận hàng</h2>
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e9e9e9; border-radius: 8px;">
        <tr>
          <td style="padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              <span style="color: #666666; font-size: 12px; display: block; margin-bottom: 3px;">Tên người nhận:</span>
              <strong style="color: #000;">${order.customer.fullName}</strong>
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              <span style="color: #666666; font-size: 12px; display: block; margin-bottom: 3px;">Số điện thoại:</span>
              <strong style="color: #000;">${order.customer.phone}</strong>
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              <span style="color: #666666; font-size: 12px; display: block; margin-bottom: 3px;">Hình thức thanh toán:</span>
              <strong style="color: #000;">${paymentMethodText}</strong>
            </p>
            <p style="margin: 0; font-size: 14px;">
              <span style="color: #666666; font-size: 12px; display: block; margin-bottom: 3px;">Địa chỉ nhận hàng:</span>
              <strong style="color: #000; line-height: 1.5;">${fullAddress}</strong>
            </p>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee;">
        <p style="font-size: 12px; color: #888888; margin: 0;">
          Mọi thắc mắc vui lòng liên hệ hotline: <strong>0375568408</strong><br/>
          © ${new Date().getFullYear()} TenClothes Store. All rights reserved.
        </p>
      </div>

    </div>
  `;
};
exports.emailTemplate = emailTemplate;
//# sourceMappingURL=emailTemplate.js.map