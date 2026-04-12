import { NavLink } from "react-router-dom";
import { useShopStore } from "../stores/useShopStore";
import Skeleton from "./skeleton/Skeleton";
import { convertPrice } from "../utils/convertPrice";

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
  const currency = useShopStore((state) => state.currency);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Skeleton className="overflow-hidden rounded-2xl w-full aspect-4/5"></Skeleton>
        <Skeleton className="h-6 rounded mt-3"></Skeleton>
        <Skeleton className="h-4 rounded mt-2"></Skeleton>
      </div>
    );
  }

  return (
    <NavLink
      to={`/collection/${slug}`}
      // Đảm bảo có h-full, flex, flex-col
      className="w-full h-full flex flex-col text-gray-700 cursor-pointer group"
    >
      <div className="overflow-hidden rounded-2xl relative">
        <img
          className="w-full aspect-4/5 object-cover group-hover:scale-105 transition duration-500 ease-in-out"
          src={media}
          alt={title}
        />
      </div>

      {/* Điểm mấu chốt: THÊM flex-1 vào thẻ p này */}
      {/* flex-1 sẽ tự động chiếm hết mọi khoảng trống thừa ra, đẩy cái giá xuống đáy */}
      <p className="pt-3 pb-2 text-sm sm:text-base font-medium flex-1">
        {title}
      </p>

      {/* Giữ nguyên mt-auto ở khối giá */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-auto">
        <p className="text-base sm:text-[18px] font-bold text-gray-900">
          {currency === "đ" && convertPrice(salePrice)}
          {currency}
        </p>

        {discountPercentage !== 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[10px] sm:text-xs py-0.5 px-2 text-white bg-blue-600 rounded-full font-semibold">
              -{discountPercentage}%
            </p>
            <p className="text-xs sm:text-sm text-gray-400 line-through">
              {currency === "đ" && convertPrice(price)}
              {currency}
            </p>
          </div>
        )}
      </div>
    </NavLink>
  );
};

export default ProductItem;
