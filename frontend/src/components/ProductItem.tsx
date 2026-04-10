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
      // Thêm h-full để card giãn đều chiều cao trong grid
      className="text-gray-700 cursor-pointer flex flex-col h-full group"
    >
      <div className="overflow-hidden rounded-2xl relative">
        <img
          className="w-full aspect-4/5 object-cover group-hover:scale-105 transition duration-500 ease-in-out"
          src={media}
          alt={title}
        />
      </div>

      {/* Thêm line-clamp-2 để giới hạn tên sản phẩm tối đa 2 dòng */}
      <p className="pt-3 pb-2 text-sm sm:text-base flex-1 font-medium">
        {title}
      </p>

      {/* mt-auto đẩy giá xuống dưới cùng. flex-wrap giúp giá tự xuống dòng nếu chật */}
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
