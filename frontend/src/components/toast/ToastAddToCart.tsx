import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { convertPrice } from "../../utils/convertPrice";
import { useShopStore } from "../../stores/useShopStore";

const ToastAddToCart = ({ t, mainImage, title, salePrice, size }: {
  t: string | number;
  mainImage: string;
  title: string;
  salePrice: number;
  size: string
}) => {

  const currency = useShopStore(state => state.currency)
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-full max-w-sm pointer-events-auto">
      {/* Header thông báo */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-gray-900 text-[16px]">
          Thêm vào giỏ hàng thành công
        </h3>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-black transition-colors"
        >
          {/* Icon X đóng (có thể dùng FontAwesome) */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex gap-4 mb-5">
        <img
          src={mainImage} // Hình ảnh sản phẩm hiện tại
          alt={title}
          className="w-16 h-20 object-cover rounded-lg border border-gray-200"
        />
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-2">
              {title}
            </p>
            <p className="text-gray-500 text-xs mt-1">Màu mặc định / {size}</p>
          </div>
          <p className="font-bold text-gray-900">
            {convertPrice(salePrice)}
            {currency}
          </p>
        </div>
      </div>

      {/* Nút Xem giỏ hàng */}
      <button
        onClick={() => {
          toast.dismiss(t); // Đóng toast
          navigate("/cart"); // Chuyển hướng sang trang giỏ hàng
        }}
        className="w-full py-2.5 px-4 bg-white border border-black text-black rounded-full font-medium text-sm hover:bg-black hover:text-white transition-all flex justify-center items-center gap-2"
      >
        XEM GIỎ HÀNG
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default ToastAddToCart;
