import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import CartErrorIcon from "../components/IconSVG/CartErrorIcon";
import CartSuccessIcon from "../components/IconSVG/CartSuccessIcon";

const MoMoReturn = () => {
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  // MoMo sẽ gắn các param lên URL, ví dụ: ?resultCode=0&orderId=abc...
  const resultCode = searchParams.get("resultCode");
  const orderId = searchParams.get("orderId"); // Đây là mã _id của MongoDB bạn đã truyền vào

  useEffect(() => {
    if (resultCode === "0") {
      // resultCode = 0 nghĩa là thanh toán thành công
      clearCart(); // Xóa giỏ hàng vì đã thanh toán xong
    }
  }, [resultCode, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {resultCode === "0" ? (
        <>
          <div className="text-green-500 text-6xl mb-4">
            <CartSuccessIcon />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-6">
            Mã đơn hàng của bạn: <strong>#{orderId}</strong>
          </p>
          <Link
            to="/"
            className="px-6 py-3 border border-black rounded hover:bg-gray-800 hover:text-white transition-all ease-in-out duration-500"
          >
            Tiếp tục mua sắm
          </Link>
        </>
      ) : (
        <>
          <div className="text-red-500 text-6xl mb-4">
            <CartErrorIcon />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Thanh toán thất bại hoặc đã bị hủy!
          </h1>
          <p className="text-gray-600 mb-6">
            Vui lòng thử lại hoặc chọn phương thức khác.
          </p>
          <Link
            to="/cart"
            className="px-6 py-3 border border-black rounded hover:bg-gray-800 hover:text-white transition-all ease-in-out duration-300"
          >
            Quay lại giỏ hàng
          </Link>
        </>
      )}
    </div>
  );
};

export default MoMoReturn;
