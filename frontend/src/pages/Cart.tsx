import { useState, useEffect } from "react";
import { PAYMENT_METHOD } from "../constants/payment";
import CartItem, { CartItemSkeleton } from "../components/cart/CartItem";
import Skeleton from "../components/skeleton/Skeleton";
import DropdownAddress from "../components/DropdownAddress/DropdownAddress";
import { useCartStore, type ICartItem } from "../stores/useCartStore";

const Cart = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // lấy các sản phẩm có trong giỏ hàng (localStorage) ra 
  const cartItems: ICartItem[] = useCartStore(state => state.cartItems)

  // Giả lập thời gian tải dữ liệu (Call API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Đổi thành thời gian call API thực tế của bạn
    return () => clearTimeout(timer);
  }, []);

  return (
    // Dùng flex-col trên mobile, lg:grid-cols-5 trên màn hình lớn
    <div className="flex flex-col lg:grid lg:grid-cols-5 py-8 sm:py-15 gap-8 lg:gap-12">
      {/* CỘT BÊN TRÁI: FORM ĐIỀN THÔNG TIN (Sẽ nằm dưới Giỏ hàng trên mobile) */}
      <div className="flex flex-col lg:col-span-3 order-2 lg:order-1">
        {/* THÔNG TIN GIAO HÀNG */}
        <div className="w-full">
          <h1 className="font-semibold text-xl sm:text-2xl mb-5">
            THÔNG TIN GIAO HÀNG
          </h1>
          <input
            type="text"
            placeholder="Họ và tên"
            className="outline-none py-2 px-3 border border-gray-400 w-full rounded mb-4 focus:border-black transition-colors"
          />

          <div className="flex flex-col sm:flex-row justify-between items-center sm:gap-4">
            <input
              type="text"
              placeholder="Email"
              className="outline-none py-2 px-3 border border-gray-400 w-full rounded mb-4 focus:border-black transition-colors"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="outline-none py-2 px-3 border border-gray-400 w-full rounded mb-4 focus:border-black transition-colors"
            />
          </div>

          <DropdownAddress/>

          <textarea
            placeholder="Ghi chú thêm (cơ quan làm việc, giao trong giờ hành chính, ...)"
            className="mt-4 outline-none py-2 px-3 border border-gray-400 w-full rounded mb-4 min-h-30 focus:border-black transition-colors"
          ></textarea>
        </div>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <div className="w-full mt-4">
          <h1 className="font-semibold text-xl sm:text-2xl mb-5">
            PHƯƠNG THỨC THANH TOÁN
          </h1>
          {PAYMENT_METHOD.map((payment) => {
            const isChecked: boolean = payment.id === paymentMethod;
            return (
              <label
                htmlFor={payment.id}
                key={payment.id}
                className={`w-full flex items-center gap-3 border px-4 py-3 mb-4 cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-gray-100 border-black"
                    : "border-gray-400 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  id={payment.id}
                  onClick={() => {
                    setPaymentMethod(payment.id);
                  }}
                  checked={isChecked}
                  readOnly
                />
                <img
                  src={payment.image}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
                <p className="text-sm sm:text-base">{payment.title}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* CỘT BÊN PHẢI: GIỎ HÀNG (Sẽ nằm trên cùng trên mobile) */}
      <div className="flex flex-col lg:col-span-2 order-1 lg:order-2 bg-white rounded-lg lg:sticky lg:top-20 h-fit">
        <div className="w-full mb-8">
          <h1 className="font-semibold text-xl sm:text-2xl">GIỎ HÀNG</h1>

          <div className="w-full max-h-100 overflow-y-auto pr-2 mt-4 custom-scrollbar">
            {isLoading ? (
              // Hiển thị 3 skeleton làm mẫu trong lúc đợi dữ liệu
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            ) : (
              // Hiển thị dữ liệu thật  
              <>
                {cartItems.map((item) => {
                  <CartItem key={item.productId} title={item.title} mainImage={item.image} salePrice={item.salePrice} quantityProps={item.quantity} size={item.size} slug={item.slug} productId={item.productId}/>
                })}
              </>
            )}
          </div>

          {/* MÃ GIẢM GIÁ */}
          <h2 className="font-semibold text-lg sm:text-xl mb-4 mt-6">
            MÃ GIẢM GIÁ
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="outline-none p-2 px-4 border border-gray-400 rounded focus:border-black transition-colors w-full sm:flex-1"
            />
            <button className="p-2 px-4 border outline-none border-gray-800 rounded cursor-pointer hover:bg-gray-800 hover:text-white transition-all duration-300 ease-in-out whitespace-nowrap w-full sm:w-auto">
              Áp dụng
            </button>
          </div>

          {/* CHI TIẾT ĐƠN HÀNG */}
          <h2 className="font-semibold text-lg sm:text-xl mb-4 mt-8">
            CHI TIẾT ĐƠN HÀNG
          </h2>
          <div className="w-full space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <p>Tạm tính</p>
              {isLoading ? <Skeleton className="w-20 h-5" /> : <p>359.000đ</p>}
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              {isLoading ? <Skeleton className="w-16 h-5" /> : <p>Miễn phí</p>}
            </div>
            <div className="flex justify-between">
              <p>Voucher giảm giá</p>
              {isLoading ? <Skeleton className="w-10 h-5" /> : <p>0đ</p>}
            </div>
          </div>

          <div className="w-full h-px bg-gray-300 my-5"></div>

          <div className="w-full flex justify-between items-start">
            <h3 className="text-xl sm:text-2xl font-semibold">Tổng</h3>
            <div className="text-right">
              {isLoading ? (
                <Skeleton className="w-28 h-7 mb-1 float-right" />
              ) : (
                <p className="font-bold text-xl sm:text-2xl mb-1 text-red-600">
                  359.000đ
                </p>
              )}
              <div className="clear-both"></div>
              <p className="text-xs sm:text-sm text-gray-500 italic mt-1">
                (Đã giảm giá trên giá gốc: 0đ)
              </p>
            </div>
          </div>
        </div>

        {/* Đổi chữ Áp dụng thành Đặt hàng ở cuối */}
        <button className="p-4 w-full bg-black text-white font-semibold text-lg border outline-none border-gray-800 rounded cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out">
          ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
};

export default Cart;
