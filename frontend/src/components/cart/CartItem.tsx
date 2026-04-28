import { useEffect, useState } from "react";
import Skeleton from "../skeleton/Skeleton";
import { NavLink } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { useShopStore } from "../../stores/useShopStore";

/* ── Skeleton ── */
export const CartItemSkeleton = () => (
  <div className="flex gap-4 py-5 border-b border-neutral-100">
    <Skeleton className="w-20 h-24 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2.5">
      <Skeleton className="h-4 w-3/5 rounded-full" />
      <Skeleton className="h-3 w-1/4 rounded-full" />
      <Skeleton className="h-3 w-1/5 rounded-full" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

/* ── CartItem ── */
const CartItem = ({
  title,
  mainImage,
  salePrice,
  quantityProps,
  size,
  slug,
  productId,
  color,
}: {
  title: string;
  mainImage: string;
  salePrice: number;
  quantityProps: number;
  size: string;
  slug: string;
  productId: string;
  color: string;
}) => {
  const [quantity, setQuantity] = useState<number>(quantityProps);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  useShopStore((s) => s.currency);

  useEffect(() => {
    updateQuantity(productId, size, color, quantity);
    if (quantity === 0) removeFromCart(productId, size, color);
  }, [quantity]);

  const lineTotal = (salePrice * quantity).toLocaleString("vi-VN");

  return (
    <div className="flex gap-4 py-5 border-b border-neutral-100 group">
      {/* Thumbnail */}
      <NavLink to={`/product/${slug}`} className="shrink-0 w-20 sm:w-24">
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#f4f3f0]">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      </NavLink>

      {/* Info */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top row */}
        <div className="flex justify-between items-start gap-3">
          <NavLink to={`/product/${slug}`} className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-[15px] font-semibold text-black leading-snug line-clamp-2 hover:underline underline-offset-2">
              {title}
            </h3>
          </NavLink>
          {/* Remove */}
          <button
            onClick={() => removeFromCart(productId, size, color)}
            className="shrink-0 text-neutral-300 hover:text-black transition-colors mt-0.5"
            aria-label="Xóa sản phẩm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Variant pills */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
            {color}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
            {size}
          </span>
        </div>

        {/* Bottom row: qty + price */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Quantity stepper */}
          <div className="flex items-center rounded-full border border-neutral-200 overflow-hidden">
            <button
              className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors select-none"
              onClick={() => setQuantity((q) => Math.max(0, Number(q) - 1))}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") setQuantity(0);
                if (!isNaN(Number(v))) setQuantity(Number(v));
              }}
              className="w-8 text-center text-sm font-semibold text-black outline-none bg-transparent"
            />
            <button
              className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors select-none"
              onClick={() => setQuantity((q) => Number(q) + 1)}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Line total */}
          <p className="text-sm sm:text-base font-bold text-black">
            {lineTotal}đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
