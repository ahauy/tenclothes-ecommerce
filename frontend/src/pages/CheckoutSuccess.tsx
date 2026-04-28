import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { convertPrice } from "../utils/convertPrice"; 
import api from "../utils/axios";
import type { IOrder } from "../interfaces/iOrder";
import { toast } from "sonner";

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fullAddress, setFullAddress] = useState<string>("");

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/checkout/success/${orderId}`);
        if (response.data.status) {
          const orderData: IOrder = response.data.data;
          setOrder(orderData);

          try {
            const [pRes, dRes, wRes] = await Promise.all([
              fetch(`https://provinces.open-api.vn/api/p/${orderData.customer.province}`),
              fetch(`https://provinces.open-api.vn/api/d/${orderData.customer.district}`),
              fetch(`https://provinces.open-api.vn/api/w/${orderData.customer.ward}`),
            ]);

            const pData = await pRes.json();
            const dData = await dRes.json();
            const wData = await wRes.json();

            setFullAddress(
              `${orderData.customer.detailAddress}, ${wData.name}, ${dData.name}, ${pData.name}`
            );
          } catch (apiError) {
            console.error("Lỗi khi dịch tên địa chỉ:", apiError);
            setFullAddress(
              `${orderData.customer.detailAddress}, Phường/Xã ${orderData.customer.ward}, Quận/Huyện ${orderData.customer.district}, Tỉnh/TP ${orderData.customer.province}`
            );
          }
        }
      } catch (error) {
        toast.error("Có lỗi khi tải thông tin đơn hàng!");
        console.error("Lỗi khi tải thông tin đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">
          Đang tải thông tin đơn hàng...
        </p>
      </div>
    );
  }

  if (!order) return null;

  // Sử dụng dữ liệu mới từ Backend (Backup fallback trong trường hợp db cũ chưa có)
  const totalProductValue = order.totalAmount || 0;
  const discountAmount = order.discountAmount || 0;
  const finalAmount = order.finalAmount || order.totalAmount;
  const couponCode = order.couponCode || null;
  const deliveryFee = 0; // Giả sử freeship

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16 font-sans text-gray-900">
      {/* --- PHẦN 1: LỜI CẢM ƠN --- */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-16 mt-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase mb-4 tracking-tight text-center">
          Đặt hàng thành công!
        </h1>
        <p className="text-sm sm:text-base text-gray-700 max-w-3xl leading-relaxed mb-8">
          Cảm ơn bạn đã lựa chọn mua sắm tại <strong>TenClothes Store</strong>.
          <br className="hidden sm:block" />
          Đơn hàng của bạn CHẮC CHẮN đã được chuyển tới hệ thống xử lý đơn hàng
          của chúng tôi. Trong quá trình xử lý, chúng tôi sẽ liên hệ lại nếu như
          cần thêm thông tin từ bạn. Ngoài ra cửa hàng cũng sẽ gửi xác nhận đơn
          hàng bằng Email.
        </p>
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors duration-300 text-center"
        >
          Khám phá thêm các sản phẩm khác tại đây
        </Link>
      </div>

      {/* --- PHẦN 2: THÔNG TIN ĐƠN HÀNG --- */}
      <div className="mb-10 sm:mb-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase mb-4 sm:mb-6">
          Thông tin đơn hàng #{order.orderCode}
        </h2>

        {/* 2.1 GIAO DIỆN MOBILE */}
        <div className="block md:hidden border-t border-gray-800 pt-4 mb-6">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 mb-4 pb-4 border-b border-gray-200 last:border-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover bg-gray-100 rounded shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Size/Color: {item.size}/{item.color} | Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-gray-400 text-xs line-through">
                    {convertPrice(item.price)} đ
                  </span>
                  <span className="text-red-600 font-bold text-sm">
                    {convertPrice(item.salePrice * item.quantity)} đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2.2 GIAO DIỆN DESKTOP/IPAD */}
        <div className="hidden md:block w-full overflow-x-auto mb-6 pb-2 rounded border border-gray-100 sm:border-none">
          <table className="w-full min-w-162.5 text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-white text-xs sm:text-sm whitespace-nowrap">
                <th className="py-3 px-4 font-semibold w-2/5 rounded-tl-sm">Sản Phẩm</th>
                <th className="py-3 px-4 font-semibold text-center">SL</th>
                <th className="py-3 px-4 font-semibold text-right">Giá Niêm Yết</th>
                <th className="py-3 px-4 font-semibold text-center">Size</th>
                <th className="py-3 px-4 font-semibold text-center">Color</th>
                <th className="py-3 px-4 font-semibold text-right rounded-tr-sm">Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 flex items-center gap-3 sm:gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover bg-gray-100 rounded shrink-0"
                    />
                    <span className="font-medium text-sm md:text-base line-clamp-2">
                      {item.title}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-sm text-gray-500 line-through">
                    {convertPrice(item.price)} đ
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-sm">{item.size}</td>
                  <td className="py-4 px-4 text-center font-medium text-sm">{item.color}</td>
                  <td className="py-4 px-4 text-right font-bold text-sm text-red-600">
                    {convertPrice(item.salePrice * item.quantity)} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cột tính toán tổng tiền có VOUCHER */}
        <div className="w-full space-y-3 sm:space-y-4 text-sm sm:text-base">
          <div className="flex justify-between border-b border-gray-200 pb-3 sm:pb-4 px-2 sm:px-4">
            <span className="text-gray-600">Tổng giá trị sản phẩm</span>
            <span className="font-bold">{convertPrice(totalProductValue)} đ</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between border-b border-gray-200 pb-3 sm:pb-4 px-2 sm:px-4">
              <span className="text-gray-600 flex items-center gap-1">
                Voucher giảm giá 
                {couponCode && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">({couponCode})</span>}
              </span>
              <span className="font-bold text-emerald-600">-{convertPrice(discountAmount)} đ</span>
            </div>
          )}

          <div className="flex justify-between pb-3 sm:pb-4 px-2 sm:px-4">
            <span className="text-gray-600">Phí giao hàng</span>
            <span className="font-bold">{deliveryFee} đ</span>
          </div>

          <div className="bg-black text-white flex justify-between items-center px-4 py-4 sm:py-5 text-base sm:text-lg rounded-sm shadow-md">
            <span className="font-bold uppercase">Tổng thanh toán</span>
            <span className="font-extrabold text-[#facc15]">{convertPrice(finalAmount)} đ</span>
          </div>
        </div>
      </div>

      {/* --- PHẦN 3: THÔNG TIN NHẬN HÀNG --- */}
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase mb-4 sm:mb-6">
          Thông tin nhận hàng
        </h2>
        <div className="bg-[#e9e9e9] p-5 sm:p-8 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base shadow-sm">
          <div className="space-y-1">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Tên người nhận:</p>
            <p className="font-bold">{order.customer.fullName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Email:</p>
            <p className="font-bold break-all">{order.customer.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Số điện thoại:</p>
            <p className="font-bold">{order.customer.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Hình thức thanh toán:</p>
            <p className="font-bold">
              {order.customer.paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Thanh toán qua MoMo"}
            </p>
          </div>
          <div className="space-y-1 sm:col-span-2 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-300 sm:border-none">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">Địa chỉ nhận hàng:</p>
            <p className="font-bold leading-relaxed">{fullAddress || "Đang tải địa chỉ..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;