import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import Skeleton from "../components/skeleton/Skeleton";
import ToastAddToCart from "../components/toast/ToastAddToCart";
import ProductReviews from "../components/ProductReviews";
import type { IProduct, IProductStyle } from "../interfaces/iProduct";
import { useCartStore, type ICartItem } from "../stores/useCartStore";
import { useShopStore } from "../stores/useShopStore";
import api from "../utils/axios";
import { convertPrice } from "../utils/convertPrice";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const currency = useShopStore((state) => state.currency);
  const addToCart = useCartStore((state) => state.addToCart);

  // --- STATE ---
  const [data, setData] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quản lý lựa chọn của người dùng
  const [selectedColor, setSelectedColor] = useState<IProductStyle | null>(
    null
  );
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  // --- FETCH DATA ---
  useEffect(() => {
    async function getAPIProductDetail() {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${slug}`);
        const productData: IProduct = response.data.data.product;

        setData(productData);

        if (productData && productData.productStyles.length > 0) {
          const defaultStyle =
            productData.productStyles.find((s) => s.isDefault) ||
            productData.productStyles[0];

          setSelectedColor(defaultStyle);
          if (defaultStyle.images.length > 0) {
            setMainImage(defaultStyle.images[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      getAPIProductDetail();
    }

    return () => {
      setData(null);
      setSelectedColor(null);
      setSize("");
      setQuantity(1);
      setMainImage("");
    };
  }, [slug]);

  // --- TÍNH TOÁN DANH SÁCH SIZE TỰ ĐỘNG ---
  // Lấy ra tất cả các size ĐANG CÓ của sản phẩm (không trùng lặp)
  const availableSizes = data
    ? Array.from(new Set(data.variants.map((v) => v.size))).sort((a, b) => {
        // Thuật toán sắp xếp thông minh: Số xếp theo số, Chữ xếp theo thứ tự S, M, L, XL
        const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Freesize"];
        const indexA = sizeOrder.indexOf(a.toUpperCase());
        const indexB = sizeOrder.indexOf(b.toUpperCase());

        // Nếu cả 2 đều là chữ (nằm trong mảng sizeOrder)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // Nếu là số (ví dụ 29, 30, 31)
        if (!isNaN(Number(a)) && !isNaN(Number(b)))
          return Number(a) - Number(b);
        return a.localeCompare(b);
      })
    : [];

  // --- XỬ LÝ GIỎ HÀNG ---
  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.warning("Vui lòng chọn màu sắc!");
      return;
    }
    if (!size) {
      toast.warning("Vui lòng chọn kích thước!");
      return;
    }

    const currentVariant = data?.variants.find(
      (v) => v.colorName === selectedColor.colorName && v.size === size
    );

    const productCart: ICartItem = {
      productId: data!._id,
      slug: data!.slug,
      title: data!.title,
      price: data!.price,
      salePrice: data!.salePrice || data!.price,
      color: selectedColor.colorName,
      size: size,
      image: mainImage,
      quantity: quantity,
      sku: currentVariant?.sku || "",
    };

    addToCart(productCart);

    toast.custom(
      (t) => (
        <ToastAddToCart
          t={t}
          salePrice={productCart.salePrice}
          title={productCart.title}
          mainImage={mainImage}
          size={size}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    );
  };

  // --- UI LOADING ---
  if (isLoading) {
    return (
      <div className="pt-10">
        <div className="flex gap-12 flex-col sm:grid grid-cols-5">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row sm:col-span-3">
            <div className="flex sm:flex-col overflow-x-auto sm:w-[15%] w-full gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full aspect-3/4" />
              ))}
            </div>
            <div className="w-full sm:w-[85%] aspect-3/4">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
          <div className="flex-1 sm:col-span-2 space-y-5">
            <Skeleton className="w-[80%] h-8" />
            <Skeleton className="w-[40%] h-6" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-10" />
              ))}
            </div>
            <Skeleton className="w-full h-14" />
          </div>
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">
        Sản phẩm không tồn tại!
      </div>
    );

  return (
    <div className="pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:grid grid-cols-5">
        {/* --- PHẦN GALLERY HÌNH ẢNH (BÊN TRÁI) --- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row sm:col-span-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[15%] w-full gap-2 scrollbar-hide">
            {selectedColor?.images.map((item, index) => (
              <div
                key={index}
                className={`w-full aspect-3/4 relative cursor-pointer shrink-0 border-2 transition-all ${
                  mainImage === item ? "border-black" : "border-transparent"
                }`}
                onClick={() => setMainImage(item)}
              >
                <img
                  src={item}
                  alt={`${data.title} - ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="w-full sm:w-[85%] aspect-3/4 bg-gray-50">
            <img
              src={mainImage}
              alt={data.title}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* --- PHẦN THÔNG TIN CHI TIẾT (BÊN PHẢI) --- */}
        <div className="flex-1 sm:col-span-2">
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-900">
            {data.title}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            <div className="flex text-yellow-400 gap-1 text-sm">
              <span className="font-bold text-black">{data.averageRating > 0 ? data.averageRating : 5.0}</span>
              <img src={assets.star_icon} alt="star" className="w-4 h-4 mt-0.5" />
            </div>
            <p className="pl-2 text-gray-500 text-sm">| Đã bán {data.sold} | {data.reviewCount} đánh giá</p>
          </div>

          <div className="mt-6">
            {data.price === data.salePrice ? (
              <p className="text-2xl font-bold text-gray-900">
                {convertPrice(data.price)} {currency}
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400 line-through">
                  {convertPrice(data.price)} {currency}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-red-600">
                    {convertPrice(data.salePrice)} {currency}
                  </p>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    -{data.discountPercentage}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CHỌN MÀU SẮC */}
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Màu sắc:{" "}
              <span className="text-black">{selectedColor?.colorName}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {data.productStyles.map((style) => {
                const isSelected = selectedColor?.colorName === style.colorName;
                return (
                  <div
                    key={style.colorName}
                    title={style.colorName}
                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 transition-all hover:scale-110 ${
                      isSelected
                        ? "border-black shadow-md"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedColor(style);
                      if (style.images.length > 0) {
                        setMainImage(style.images[0]);
                      }
                      setSize("");
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: style.colorHex }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHỌN KÍCH THƯỚC (RENDER TỰ ĐỘNG TỪ DỮ LIỆU) */}
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Chọn kích thước
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((opt) => {
                const variant = data.variants.find(
                  (v) =>
                    v.size.toUpperCase() === opt.toUpperCase() &&
                    v.colorName === selectedColor?.colorName
                );

                const isOutOfStock = !variant || variant.stock <= 0;
                const isSelected = size === opt;

                return (
                  <button
                    key={opt}
                    disabled={isOutOfStock}
                    className={`min-w-15 h-11 border transition-all text-sm font-medium ${
                      isSelected
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-900 border-gray-300 hover:border-black"
                    } ${
                      isOutOfStock
                        ? "opacity-20 cursor-not-allowed line-through bg-gray-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => setSize(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHỌN SỐ LƯỢNG */}
          <div className="flex flex-col gap-4 my-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Số lượng
            </p>
            <div className="flex items-center">
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-14 h-10 border-t border-b border-gray-300 text-center outline-none"
              />
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* NÚT HÀNH ĐỘNG */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 bg-white text-black border border-black h-14 font-bold text-sm hover:bg-black hover:text-white transition-all uppercase"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
            <button className="flex-1 bg-black text-white h-14 font-bold text-sm hover:bg-gray-800 transition-all uppercase">
              Mua ngay
            </button>
          </div>

          {/* Chính sách */}
          <div className="mt-10 pt-8 border-t border-gray-100 space-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <img src={assets.exchange_icon} className="w-5" alt="" />
              <p>Cam kết 100% hàng chính hãng.</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={assets.quality_icon} className="w-5" alt="" />
              <p>Đổi trả dễ dàng trong vòng 7 ngày.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS: MÔ TẢ & ĐÁNH GIÁ */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === "description" ? "border-b-2 border-black bg-gray-50 text-black" : "text-gray-400 hover:text-black"}`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả sản phẩm
          </button>
          <button 
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === "reviews" ? "border-b-2 border-black bg-gray-50 text-black" : "text-gray-400 hover:text-black"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá ({data.reviewCount})
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="relative py-10">
            <div
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                showDescription ? "" : "max-h-60"
              }`}
            >
              <div
                className="prose prose-sm max-w-none h-full overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: data.description || "Chưa có mô tả!",
                }}
              ></div>
            </div>
            <div
              className={`absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-white to-transparent pointer-events-none transition-opacity duration-500 ${
                showDescription ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <button
              className="border border-black rounded-full outline-none px-6 py-2 absolute left-[50%] bottom-0 -translate-x-[50%] translate-y-[50%] z-10 bg-white text-black text-sm font-medium cursor-pointer hover:bg-black hover:text-white transition-all ease-in"
              onClick={() => {
                setShowDescription(!showDescription);
              }}
            >
              {showDescription ? "Thu gọn nội dung" : "Xem thêm mô tả"}
            </button>
          </div>
        ) : (
          <div className="py-6 bg-gray-50 border-t border-gray-100">
            <ProductReviews 
              productId={data._id} 
              averageRating={data.averageRating > 0 ? data.averageRating : 5.0}
              reviewCount={data.reviewCount}
            />
          </div>
        )}
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      <RelatedProduct slug={slug} />
    </div>
  );
};

export default Product;
