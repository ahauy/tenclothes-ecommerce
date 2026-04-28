import { NavLink } from "react-router-dom";
import Skeleton from "./skeleton/Skeleton";
import { useShopStore } from "../stores/useShopStore";

/* ── helper: format VND ── */
const fmt = (n?: number) =>
  n && n > 0 ? n.toLocaleString("vi-VN") + "đ" : "";

const ProductItem = ({
  slug,
  title,
  price,
  salePrice,
  discountPercentage,
  media,
  isLoading,
}: {
  slug?: string;
  title?: string;
  price?: number;
  salePrice?: number;
  discountPercentage?: number;
  media?: string;
  isLoading?: boolean;
}) => {
  // useShopStore kept for future currency switching
  useShopStore((s) => s.currency);

  /* ── Skeleton state ── */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
        <Skeleton className="h-3.5 w-4/5 rounded-full" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
      </div>
    );
  }

  const hasDiscount = !!discountPercentage && discountPercentage > 0;
  const displayPrice = fmt(salePrice);
  const originalPrice = fmt(price);

  return (
    <NavLink
      to={`/product/${slug}`}
      className="flex flex-col w-full h-full group cursor-pointer"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#f0eeeb] aspect-[3/4]">
        {media ? (
          <img
            src={media}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          /* placeholder when no image */
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Discount badge — only when discount > 0 */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-bold leading-none px-2.5 py-1.5 rounded-full tracking-wider">
            -{discountPercentage}%
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full shadow-sm">
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1.5 pt-3.5 flex-1">
        {/* Title */}
        <p className="text-[13px] sm:text-sm font-medium text-black leading-snug line-clamp-2">
          {title}
        </p>

        {/* Price block */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          {/* Sale price (always shown) */}
          <span className="text-sm sm:text-base font-bold text-black">
            {displayPrice}
          </span>

          {/* Original price + badge — only when discounted */}
          {hasDiscount && originalPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through font-normal">
                {originalPrice}
              </span>
              <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default ProductItem;
