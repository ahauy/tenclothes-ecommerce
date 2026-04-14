import { useEffect, useState } from "react";
import Skeleton from "../skeleton/Skeleton";
import { NavLink } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { convertPrice } from "../../utils/convertPrice";
import { useShopStore } from "../../stores/useShopStore";

export const CartItemSkeleton = () => {
  return (
    <div className="w-full flex gap-3 sm:gap-5 border-b border-gray-300 py-4 sm:py-5">
      <div className="w-[30%] sm:w-[25%]">
        <Skeleton className="w-full aspect-3/4 object-cover" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="w-[60%] space-y-2">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-20 h-5" />
        </div>
        <div className="flex items-center gap-4 mt-3">
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-10 h-5" />
        </div>
      </div>
    </div>
  );
};

const CartItem = ({
  title,
  mainImage,
  salePrice,
  quantityProps,
  size,
  slug,
  productId,
  color
}: {
  title: string;
  mainImage: string;
  salePrice: number;
  quantityProps: number;
  size: string;
  slug: string;
  productId: string;
  color: string
}) => {
  const [quantity, setQuantity] = useState<number>(quantityProps);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const currency: string = useShopStore((state) => state.currency)

  useEffect(() => {
    updateQuantity(productId, size, color, quantity);
    if(quantity == 0) {
      removeFromCart(productId, size, color)
    }
  }, [quantity]);

  return (
    <div className="w-full flex gap-3 sm:gap-5 border-b border-gray-300 py-4 sm:py-5">
      {/* Hình ảnh */}
      <NavLink to={`/product/${slug}`} className="w-[30%] sm:w-[25%]">
        <img
          src={mainImage}
          alt=""
          className="w-full aspect-3/4 object-cover rounded-lg"
        />
      </NavLink>

      {/* Thông tin */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-5">
          {/* Tên & Size */}
          <div>
            <NavLink to={`/product/${slug}`}>
              <h3 className="font-semibold text-[15px] sm:text-[18px] leading-tight">
                {title}
              </h3>
            </NavLink>
            <p className="text-sm text-gray-600 mt-1">{color} / {size}</p>
          </div>
          {/* Giá (Đưa lên góc phải trên cùng để không đè nút) */}
          <p className="font-semibold text-[15px] sm:text-[18px]">
            {convertPrice(salePrice)}{currency}
          </p>
        </div>

        {/* Nút tăng giảm & Xóa */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <div className="flex">
            <div
              className={`px-3 py-1 border border-black border-r-0 cursor-pointer select-none flex items-center justify-center`}
              onClick={() => {
                const currentQuantity: number = Number(quantity) || 0;
                setQuantity(currentQuantity - 1);
              }}
            >
              -
            </div>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const val: string = e.target.value;
                if (val === "") setQuantity(0);
                if (!isNaN(Number(val))) setQuantity(Number(val));
              }}
              className="max-w-10 px-2 py-1 border border-black outline-none text-center"
            />
            <div
              className="px-3 py-1 border border-black border-l-0 cursor-pointer select-none flex items-center justify-center"
              onClick={() => {
                const currentQuantity: number = Number(quantity) || 0;
                setQuantity(currentQuantity + 1);
              }}
            >
              +
            </div>
          </div>
          <button
            className="cursor-pointer text-gray-500 hover:text-black hover:underline"
            onClick={() => {
              removeFromCart(productId, size, color);
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
