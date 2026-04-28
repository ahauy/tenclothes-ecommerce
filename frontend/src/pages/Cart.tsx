import { useEffect, useState } from "react";
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
import { useAuthStore } from "../stores/useAuthStore";

const Cart = () => {
  // isLoading để hiển thị Skeleton khi đang gọi API lấy data giỏ hàng
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // isSubmitting để khóa nút bấm khi đang gửi đơn hàng
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State lưu dữ liệu ĐẦY ĐỦ (có tên, ảnh, giá, ....) trả về từ Backend
  const [validatedCart, setValidatedCart] = useState<ICartItem[]>([]);

  const currency: string = useShopStore((state) => state.currency);
  const delivery_fee: number = useShopStore((state) => state.delivery_fee);

  // Lấy danh sách 3 trường (productId, size, quantity) từ LocalStorage
  const cartItems: ICartItem[] = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  // Gọi API lấy dữ liệu tươi mỗi khi vào trang hoặc khi giỏ hàng thay đổi số lượng/xóa món
  useEffect(() => {
    const fetchValidatedCart = async () => {
      // Nếu giỏ hàng local trống, không cần gọi API
      if (!cartItems || cartItems.length === 0) {
        setValidatedCart([]);
        setIsLoading(false);
        return;
      }

      try {
        // setIsLoading(true);
        // Gọi API lên Backend để lấy thông tin giá, ảnh, tên mới nhất
        const response = await api.post("/cart/local-validate", { items: cartItems });
        
        if (response.data.status) {
          setValidatedCart(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi đồng bộ giỏ hàng:", error);
        toast.error("Không thể cập nhật thông tin giỏ hàng lúc này!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchValidatedCart();
  }, [cartItems]); // useEffect sẽ chạy lại nếu cartItems thay đổi (vd: xóa sp, tăng giảm SL)

  // Tính tiền DỰA TRÊN DỮ LIỆU TỪ BACKEND TRẢ VỀ (chống hack giá local)
  const totalSalePrice: number = (validatedCart).reduce((acc, cur) => {
    return acc + (cur.salePrice * cur.quantity);
  }, 0);

  const totalPrice: number = (validatedCart).reduce((acc, cur) => {
    return acc + (cur.price * cur.quantity);
  }, 0);

  const handleSubmitSuccess = async (data: CheckoutInfoValue) => {
    if (!cartItems.length) {
      toast.warning("Giỏ hàng của bạn đang bị trống!");
      return;
    }

    try {
      setIsSubmitting(true); // Khóa nút bấm

      const orderPayload = {
        customer: data,
        // Chỉ gửi 3 trường lên Backend cho nhẹ, vì Backend đã tự tính tiền rồi
        items: cartItems, 
        totalAmount: totalSalePrice + delivery_fee, 
      };

      const token = useAuthStore.getState().accessToken;
      const response = await api.post(`/orders`, orderPayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.status === 201 || response.status === 200) {
        const paymentMethod: string = data.paymentMethod;

        if (paymentMethod === "cod") {
          toast.success("Đặt hàng thành công!");
          navigate("/checkout/success", {
            state: { orderId: response.data.data._id },
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
    } finally {
      setIsSubmitting(false); // Mở lại nút bấm
    }
  };

  return (
    <>
      {/* Định nghĩa CSS Animation giống hệt Profile.tsx */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-delay-1 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .animate-delay-2 {
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>

      <div className="flex flex-col lg:grid lg:grid-cols-5 py-8 sm:py-15 gap-8 lg:gap-12">
        {/* CỘT BÊN TRÁI: FORM ĐIỀN THÔNG TIN (Hiệu ứng xuất hiện đầu tiên) */}
        <div className="lg:col-span-3 animate-fade-in-up">
          <FormCheckoutInfo onSubmitSuccess={handleSubmitSuccess} />
        </div>

        {/* CỘT BÊN PHẢI: GIỎ HÀNG (Hiệu ứng delay 1 chút so với form) */}
        <div className="flex flex-col lg:col-span-2 order-1 lg:order-2 bg-white rounded-lg lg:sticky lg:top-20 h-fit animate-fade-in-up animate-delay-1">
          <div className="w-full mb-8">
            <h1 className="font-semibold text-xl sm:text-2xl">GIỎ HÀNG</h1>

            <div className="w-full pr-2 mt-4">
              {!isLoading && validatedCart.length === 0 && (
                <div className="w-full flex flex-col justify-center items-center">
                  <EmptyCartIcon />
                  <p className="text-gray-500 font-semibold text-2xl mt-2">
                    Không có sản phẩm!
                  </p>
                  <NavLink
                    to="/collection"
                    className="cursor-pointer px-4 py-3 border border-black mt-4 rounded hover:bg-black hover:text-white transition ease-in duration-200"
                  >
                    MUA SẮM NGAY
                  </NavLink>
                </div>
              )}
              
              {isLoading ? (
                // Hiển thị 3 skeleton làm mẫu trong lúc đợi dữ liệu từ API
                <>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </>
              ) : (
                // Render dữ liệu thật từ Backend trả về
                <>
                  {(validatedCart).map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.size}`}
                      title={item.title}
                      mainImage={item.image}
                      salePrice={item.salePrice}
                      quantityProps={item.quantity}
                      size={item.size}
                      color={item.color}
                      slug={item.slug}
                      productId={item.productId}
                    />
                  ))}
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
              <div className="flex justify-between items-center">
                <p>Tạm tính</p>
                {isLoading ? (
                  <Skeleton className="w-20 h-5" />
                ) : (
                  <p>{convertPrice(totalSalePrice)}{currency}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p>Phí giao hàng</p>
                {isLoading ? (
                  <Skeleton className="w-16 h-5" />
                ) : (
                  <p>{delivery_fee}{currency}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
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
                    {convertPrice(totalSalePrice + (validatedCart.length > 0 ? delivery_fee : 0))}
                    {currency}
                  </p>
                )}
                <div className="clear-both"></div>
                {validatedCart.length > 0 && !isLoading && (
                  <p className="text-xs sm:text-sm text-gray-500 italic mt-1">
                    (Đã tiết kiệm được: {convertPrice(totalPrice - totalSalePrice)}{currency})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nút Đặt hàng với trạng thái Loading */}
          <button
            type="submit"
            form="checkout-info-form"
            disabled={isSubmitting || isLoading || validatedCart.length === 0}
            className={`p-4 w-full text-white font-semibold text-lg border outline-none rounded transition-all duration-300 ease-in-out ${
              isSubmitting || isLoading || validatedCart.length === 0
                ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                : "bg-black border-gray-800 hover:bg-gray-800 cursor-pointer"
            }`}
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;