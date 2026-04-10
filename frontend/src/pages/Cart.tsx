import { useState } from "react";
import CartItem, { CartItemSkeleton } from "../components/cart/CartItem";
import Skeleton from "../components/skeleton/Skeleton";
import { useCartStore, type ICartItem } from "../stores/useCartStore";
import { convertPrice } from "../utils/convertPrice";
import { useShopStore } from "../stores/useShopStore";
import FormCheckoutInfo from "../components/checkoutInfo/FormCheckoutInfo";
import type { CheckoutInfoValue } from "../validators/checkoutInforStore.validate";
import { toast } from "sonner";
import api from "../utils/axios";
import { NavLink, useNavigate } from "react-router-dom";
import EmptyCartIcon from "../components/IconSVG/EmptyCartIcon";

const Cart = () => {
  const [isLoading] = useState<boolean>(false);
  const currency: string = useShopStore((state) => state.currency);
  const delivery_fee: number = useShopStore((state) => state.delivery_fee);

  // Lấy danh sách sản phẩm
  const cartItems: ICartItem[] = useCartStore((state) => state.cartItems);

  const clearCart = useCartStore((s) => s.clearCart);

  const totalSalePrice: number = cartItems.reduce((acc, cur) => {
    return acc + cur.salePrice;
  }, 0);

  const totalPrice: number = cartItems.reduce((acc, cur) => {
    return acc + cur.price;
  }, 0);

  const navigate = useNavigate();

  const handleSubmitSuccess = async (data: CheckoutInfoValue) => {
    if (!cartItems.length) {
      toast.warning("Giỏ hàng của bạn đang bị trống!");
      return;
    }

    try {
      const orderPayload = {
        customer: data,
        items: cartItems,
        totalAmount: totalSalePrice + delivery_fee,
      };

      const response = await api.post(`/orders`, orderPayload);

      if (response.status === 201 || response.status === 200) {
        const paymentMethod: string = data.paymentMethod;

        if (paymentMethod === "cod") {
          toast.success("Đặt hàng thành công!");
          navigate("/checkout/success", {
            state: { orderID: response.data.data._id },
          });
          clearCart();
        } else if (paymentMethod === "momo") {
          const payUrl: string = response.data.payUrl;

          if (payUrl) {
            window.location.href = payUrl;
          } else {
            toast.error("Không thể khởi tạo thanh toán Momo!");
          }
        }
      }
    } catch (error) {
      console.log("Lỗi khi đặt hàng: ", error);
      toast.error("Đã xảy ra lỗi khi đặt hàng!");
    }
  };

  return (
    // Dùng flex-col trên mobile, lg:grid-cols-5 trên màn hình lớn
    <div className="flex flex-col lg:grid lg:grid-cols-5 py-8 sm:py-15 gap-8 lg:gap-12">
      {/* CỘT BÊN TRÁI: FORM ĐIỀN THÔNG TIN (Sẽ nằm dưới Giỏ hàng trên mobile) */}
      <FormCheckoutInfo onSubmitSuccess={handleSubmitSuccess} />

      {/* CỘT BÊN PHẢI: GIỎ HÀNG (Sẽ nằm trên cùng trên mobile) */}
      <div className="flex flex-col lg:col-span-2 order-1 lg:order-2 bg-white rounded-lg lg:sticky lg:top-20 h-fit">
        <div className="w-full mb-8">
          <h1 className="font-semibold text-xl sm:text-2xl">GIỎ HÀNG</h1>

          <div className="w-full pr-2 mt-4">
            {cartItems.length === 0 && (
              <div className="w-full flex flex-col justify-center items-center">
                <EmptyCartIcon />
                <p className="text-gray-500 font-semibold text-2xl">
                  Không có sản phẩm!
                </p>
                <NavLink
                  to="/"
                  className="cursor-pointer px-4 py-3 border border-black mt-4 rounded hover:bg-black hover:text-white transition ease-in duration-200"
                >
                  MUA SẮM NGAY
                </NavLink>
              </div>
            )}
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
                {cartItems &&
                  cartItems.map((item) => {
                    return (
                      <>
                        <CartItem
                          key={item.productId}
                          title={item.title}
                          mainImage={item.image}
                          salePrice={item.salePrice}
                          quantityProps={item.quantity}
                          size={item.size}
                          slug={item.slug}
                          productId={item.productId}
                        />
                      </>
                    );
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
              {isLoading ? (
                <Skeleton className="w-20 h-5" />
              ) : (
                <p>
                  {convertPrice(totalSalePrice)}
                  {currency}
                </p>
              )}
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng</p>
              {isLoading ? (
                <Skeleton className="w-16 h-5" />
              ) : (
                <p>
                  {delivery_fee}
                  {currency}
                </p>
              )}
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
                  {convertPrice(totalSalePrice)}
                  {currency}
                </p>
              )}
              <div className="clear-both"></div>
              <p className="text-xs sm:text-sm text-gray-500 italic mt-1">
                (Đã giảm giá trên giá gốc:{" "}
                {convertPrice(totalPrice - totalSalePrice)}
                {currency})
              </p>
            </div>
          </div>
        </div>

        {/* Đổi chữ Áp dụng thành Đặt hàng ở cuối */}
        <button
          type="submit"
          form="checkout-info-form"
          className="p-4 w-full bg-black text-white font-semibold text-lg border outline-none border-gray-800 rounded cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out"
        >
          ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
};

export default Cart;
