import { useEffect, useState } from "react";
import CartItem, { CartItemSkeleton } from "../components/cart/CartItem";
import Skeleton from "../components/skeleton/Skeleton";
import { useCartStore, type ICartItem } from "../stores/useCartStore";
import { useShopStore } from "../stores/useShopStore";
import FormCheckoutInfo from "../components/checkoutInfo/FormCheckoutInfo";
import type { CheckoutInfoValue } from "../validators/checkoutInforStore.validate";
import { toast } from "sonner";
import api from "../utils/axios";
import { NavLink, useNavigate } from "react-router-dom";
import EmptyCartIcon from "../components/IconSVG/EmptyCartIcon";
import { useAuthStore } from "../stores/useAuthStore";

const Cart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validatedCart, setValidatedCart] = useState<ICartItem[]>([]);

  // --- State cho Coupon ---
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const delivery_fee: number = useShopStore((s) => s.delivery_fee);
  const cartItems: ICartItem[] = useCartStore((s) => s.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchValidatedCart = async () => {
      if (!cartItems || cartItems.length === 0) {
        setValidatedCart([]);
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.post("/cart/local-validate", { items: cartItems });
        if (response.data.status) setValidatedCart(response.data.data);
      } catch {
        toast.error("Không thể cập nhật thông tin giỏ hàng lúc này!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchValidatedCart();
  }, [cartItems]);

  // Tính toán các con số tổng quát
  const totalSalePrice: number = validatedCart.reduce((acc, cur) => acc + cur.salePrice * cur.quantity, 0);
  const totalPrice: number = validatedCart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  
  // Tổng thanh toán cuối cùng = (Tạm tính + Ship) - Giảm giá
  const totalFinal: number = Math.max(0, totalSalePrice + (validatedCart.length > 0 ? delivery_fee : 0) - discountAmount);
  const savedAmount: number = (totalPrice - totalSalePrice) + discountAmount;

  // Tự động reset mã giảm giá nếu giỏ hàng thay đổi để đảm bảo tính đúng đắn của cartTotal
  useEffect(() => {
    if (appliedCoupon) {
      setDiscountAmount(0);
      setAppliedCoupon(null);
      toast.info("Giỏ hàng đã thay đổi, vui lòng áp dụng lại mã giảm giá.");
    }
  }, [totalSalePrice]);

  // Hàm xử lý áp dụng mã giảm giá
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const productIds = validatedCart.map(item => item.productId);
      const token = useAuthStore.getState().accessToken;

      // Gửi code, cartTotal và productIds lên Server
      const response = await api.post("/coupons/validate", {
        code: couponCode.trim(),
        cartTotal: totalSalePrice,
        productIds: productIds
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.status) {
        toast.success("Áp dụng mã giảm giá thành công!");
        setDiscountAmount(response.data.data.discountAmount);
        setAppliedCoupon(response.data.data.code);
      }
    } catch (error: any) {
      setDiscountAmount(0);
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ!");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitSuccess = async (data: CheckoutInfoValue) => {
    if (!cartItems.length) { toast.warning("Giỏ hàng của bạn đang bị trống!"); return; }
    try {
      setIsSubmitting(true);
      const orderPayload = {
        customer: data,
        items: cartItems,
        totalAmount: totalFinal, // Gửi tổng tiền đã trừ khuyến mãi
        couponCode: appliedCoupon,
        discountAmount: discountAmount
      };
      const token = useAuthStore.getState().accessToken;
      const response = await api.post(`/orders`, orderPayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.status === 201 || response.status === 200) {
        if (data.paymentMethod === "cod") {
          toast.success("Đặt hàng thành công!");
          navigate("/checkout/success", { state: { orderId: response.data.data._id } });
          clearCart();
        } else if (data.paymentMethod === "momo") {
          const payUrl: string = response.data.payUrl;
          if (payUrl) window.location.href = payUrl;
          else toast.error("Không thể khởi tạo thanh toán Momo!");
        }
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi đặt hàng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 py-10 sm:py-16 gap-8 lg:gap-14">
      {/* ── LEFT: Checkout form ── */}
      <div className="lg:col-span-3 animate-fade-in-up">
        <FormCheckoutInfo onSubmitSuccess={handleSubmitSuccess} />
      </div>

      {/* ── RIGHT: Order summary ── */}
      <div className="lg:col-span-2 order-first lg:order-none animate-fade-in-up animate-delay-1">
        <div className="lg:sticky lg:top-24 flex flex-col gap-0 bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-black tracking-wide">
                Giỏ hàng
              </h2>
              {!isLoading && validatedCart.length > 0 && (
                <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                  {validatedCart.length} sản phẩm
                </span>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div className="px-6 max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {!isLoading && validatedCart.length === 0 && (
              <div className="flex flex-col items-center py-12 gap-4 text-center">
                <EmptyCartIcon />
                <p className="text-base font-semibold text-black">Giỏ hàng trống</p>
                <p className="text-sm text-neutral-400">Hãy thêm sản phẩm để tiếp tục.</p>
                <NavLink
                  to="/collection/all"
                  className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Mua sắm ngay →
                </NavLink>
              </div>
            )}

            {isLoading && (
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            )}

            {!isLoading && validatedCart.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}-${item.color}`}
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
          </div>

          {/* Coupon Input Area */}
          <div className="px-6 pt-5 pb-5 border-t border-neutral-100">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              Mã giảm giá
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã voucher..."
                disabled={validatedCart.length === 0 || isApplyingCoupon}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-neutral-200 outline-none focus:border-black transition-colors placeholder-neutral-300 disabled:bg-neutral-50"
              />
              <button 
                onClick={handleApplyCoupon}
                disabled={!couponCode || isApplyingCoupon || validatedCart.length === 0}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-black hover:text-white text-sm font-semibold text-neutral-700 transition-all duration-200 whitespace-nowrap disabled:opacity-50"
              >
                {isApplyingCoupon ? "Đang xử lý..." : "Áp dụng"}
              </button>
            </div>
          </div>

          {/* Order summary details */}
          <div className="px-6 pt-1 pb-5 border-t border-neutral-100">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-4 pt-4">
              Chi tiết đơn hàng
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Tạm tính</span>
                {isLoading
                  ? <Skeleton className="w-20 h-4 rounded" />
                  : <span className="text-black font-medium">{totalSalePrice.toLocaleString("vi-VN")}đ</span>
                }
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Phí giao hàng</span>
                {isLoading
                  ? <Skeleton className="w-16 h-4 rounded" />
                  : <span className="text-black font-medium">{validatedCart.length > 0 ? `${delivery_fee.toLocaleString("vi-VN")}đ` : "—"}</span>
                }
              </div>
              <div className="flex justify-between text-neutral-500">
                <span className="flex items-center gap-1">
                  Voucher giảm giá 
                  {appliedCoupon && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">({appliedCoupon})</span>}
                </span>
                {isLoading 
                  ? <Skeleton className="w-10 h-4 rounded" /> 
                  : <span className={discountAmount > 0 ? "text-emerald-600 font-bold" : ""}>
                      {discountAmount > 0 ? `-${discountAmount.toLocaleString("vi-VN")}đ` : "—"}
                    </span>
                }
              </div>
            </div>

            <div className="my-4 h-px bg-neutral-100" />

            <div className="flex items-end justify-between">
              <span className="text-sm font-semibold text-black">Tổng cộng</span>
              <div className="text-right">
                {isLoading
                  ? <Skeleton className="w-28 h-6 rounded mb-1" />
                  : (
                    <>
                      <p className="text-xl font-bold text-black">
                        {totalFinal.toLocaleString("vi-VN")}đ
                      </p>
                      {savedAmount > 0 && (
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">
                          Tiết kiệm {savedAmount.toLocaleString("vi-VN")}đ
                        </p>
                      )}
                    </>
                  )
                }
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              type="submit"
              form="checkout-info-form"
              disabled={isSubmitting || isLoading || validatedCart.length === 0}
              className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                isSubmitting || isLoading || validatedCart.length === 0
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-800 active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : "Đặt hàng ngay"}
            </button>

            {validatedCart.length > 0 && !isLoading && (
              <p className="text-center text-[11px] text-neutral-400 mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Thanh toán được mã hóa & bảo mật
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;