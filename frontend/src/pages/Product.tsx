import { useEffect, useState } from "react";
import RelatedProduct from "../components/RelatedProduct";
import { useShopStore } from "../stores/useShopStore";
import { SIZE_OPTIONS } from "../constants/fIlterOptions";
import api from "../utils/axios";
import { useParams } from "react-router-dom";
import { convertPrice } from "../utils/convertPrice";
import type { IProduct, IVariants } from "../interfaces/iProduct";
import { assets } from "../assets/assets";
import Skeleton from "../components/skeleton/Skeleton";
import { toast } from "sonner";
import { useCartStore, type ICartItem } from "../stores/useCartStore";
import ToastAddToCart from "../components/toast/ToastAddToCart";


const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const currency = useShopStore((state) => state.currency);
  const addToCart = useCartStore((state) => state.addToCart)

  // STATE
  const [data, setData] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [showDescription, setShowDescription] = useState<boolean>(false);

  useEffect(() => {
    async function getAPIProductDetail() {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${slug}`);
        const productData: IProduct = response.data.data.product;

        setData(productData);

        // gán hình ảnh chính
        if (productData && productData.media.length > 0) {
          setMainImage(productData.media[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      getAPIProductDetail();
    }

    return () => {
      setData(null);
      setIsLoading(true);
      setSize("");
      setQuantity(1);
      setMainImage("");
    };
  }, [slug]);


  if (isLoading) {
    return (
      <div className="border-t-2 pt-10">
        <div className="flex gap-12 sm:gap-12 flex-col sm:grid grid-cols-5">
          {/* SKELETON PHẦN HÌNH ẢNH (Bên trái) */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row sm:col-span-3">
            {/* List thumbnail skeleton */}
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[15%] w-full gap-2 sm:gap-5">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full aspect-3/4 sm:w-full sm:mb-3"
                />
              ))}
            </div>
            {/* Ảnh chính skeleton */}
            <div className="w-full sm:w-[85%] object-cover aspect-3/4 h-full">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* SKELETON PHẦN THÔNG TIN (Bên phải) */}
          <div className="flex-1 sm:col-span-2 space-y-5">
            {/* Tiêu đề skeleton */}
            <Skeleton className="w-[80%] h-8 mt-2" />
            {/* Rating skeleton */}
            <div className="flex items-center gap-1">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-10 h-4 ml-2" />
            </div>
            {/* Giá skeleton */}
            <div className="space-y-2 mt-5">
              <Skeleton className="w-[30%] h-5" /> {/* Giá gốc */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-[50%] h-10" /> {/* Giá sale */}
                <Skeleton className="w-16 h-8 rounded-3xl" />{" "}
                {/* Tag giảm giá */}
              </div>
            </div>
            {/* Size selector skeleton */}
            <div className="flex flex-col gap-4 my-8">
              <Skeleton className="w-24 h-5" /> {/* Label */}
              <div className="flex gap-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="w-16 h-10 rounded" />
                ))}
              </div>
            </div>
            {/* Quantity selector skeleton */}
            <div className="flex flex-col gap-4 my-8">
              <Skeleton className="w-32 h-5" /> {/* Label */}
              <Skeleton className="w-40 h-10 rounded" />
            </div>
            {/* Buttons skeleton */}
            <div className="w-full sm:w-4/5 flex justify-between gap-5">
              <Skeleton className="w-full h-14 rounded" />
              <Skeleton className="w-full h-14 rounded" />
            </div>
            {/* Misc text skeleton */}
            <Skeleton className="mt-8 sm:w-4/5 h-px" /> {/* hr */}
            <div className="flex flex-col gap-2 mt-5">
              <Skeleton className="w-[90%] h-4" />
              <Skeleton className="w-[90%] h-4" />
              <Skeleton className="w-[90%] h-4" />
            </div>
          </div>
        </div>

        {/* SKELETON PHẦN MÔ TẢ (Description & Review Tabs) */}
        <div className="mt-20">
          <div className="flex">
            <Skeleton className="w-32 h-11 border border-b-0" /> {/* Tab 1 */}
            <Skeleton className="w-32 h-11 border border-l-0 border-b-0" />{" "}
            {/* Tab 2 */}
          </div>
          {/* Khối nội dung mô tả */}
          <div className="border border-t-0 p-6 space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-[80%] h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !data) {
    return <div>No Product!</div>;
  }

  const product: IProduct = data!;


  function handleAddToCart() {
    if(!size) {
      toast.warning("Vui lòng hãy chọn size cho sản phẩm!")
    } else {
      const productCart: ICartItem = {
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice!,
        size: size,
        image: mainImage,
        quantity: quantity
      }

      addToCart(productCart)
      toast.custom((t) => (
        <ToastAddToCart t={t} salePrice={product.salePrice!} title={product.title} mainImage={mainImage} size={size}/>
      ), {
        duration: 4000, // Tự động đóng sau 4 giây
        position: 'top-right', // Hoặc top-center tùy ý bạn
      });
    }
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:grid grid-cols-5">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row sm:col-span-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[15%] w-full gap-2 sm:gap-5">
            {product.media.map((item, index) => {
              const isChecked: boolean = mainImage === item;
              return (
                <div className="w-full aspect-3/4 relative cursor-pointer">
                  <div
                    className={`absolute inset-0 ${
                      isChecked
                        ? "bg-gray-400 opacity-40 border border-gray-800"
                        : ""
                    }`}
                    onClick={() => {
                      setMainImage(item);
                    }}
                  ></div>
                  <img
                    key={index}
                    src={item}
                    alt=""
                    className={`w-full h-full object-cover sm:w-full sm:mb-3`}
                  />
                </div>
              );
            })}
          </div>
          <div className="w-full sm:w-[85%] object-cover aspect-3/4 h-full">
            <img
              src={mainImage}
              alt=""
              className="w-full h-auto transition-all ease-in"
            />
          </div>
        </div>
        <div className="flex-1 sm:col-span-2">
          <h1 className="font-medium text-2xl mt-2">{product.title}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3 " />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className="pl-2">(122)</p>
          </div>
          <div>
            {product.price === product.salePrice ? (
              <>
                <p className="mt-5 text-3xl font-medium">
                  {convertPrice(product.price)} {currency}
                </p>
              </>
            ) : (
              <>
                <p className="mt-5 text-sm text-gray-500 line-through">
                  {convertPrice(product.price)} {currency}
                </p>
                <p className="mt-1 text-3xl font-medium relative">
                  {convertPrice(product.salePrice)}
                  {currency}
                  <span className="text-sm font-bold rounded-3xl bg-blue-700 text-white px-3 py-2 absolute top-0 ml-2">
                    -{product.discountPercentage}%
                  </span>
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((opt) => {
                // kiểm tra xem size có trong dữ liệu trả về từ backend hay không
                const variant: IVariants | undefined = product.variants.find(
                  (v) => opt.value === v.size?.toLocaleUpperCase()
                );

                const isOutOfStock: boolean = !variant || variant.stock === 0;

                const isCheck = size === opt.value;
                return (
                  <>
                    <button
                      disabled={isOutOfStock}
                      className={`select-none border py-2 px-4 text-black ${
                        isCheck
                          ? "bg-black text-white border-black"
                          : "hover:bg-gray-400 hover:text-white border-black"
                      } ${
                        isOutOfStock
                          ? "opacity-30 bg-gray-600 text-gray-400 border-gray-700 pointer-events-none"
                          : "cursor-pointer "
                      }`}
                      onClick={() => {
                        setSize(opt.value);
                      }}
                    >
                      {opt.label}
                    </button>
                  </>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 my-8">
            <p>Select quantity</p>
            <div className="flex">
              <div
                className={`px-4 py-2 border border-black border-r-0 cursor-pointer select-none ${
                  quantity === 1 ? "pointer-events-none" : ""
                }`}
                onClick={() => {
                  const currentQuantity: number = Number(quantity) || 0;
                  if (currentQuantity <= 1) return;
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

                  if (val === "") {
                    setQuantity(0);
                  }

                  if (!isNaN(Number(val))) {
                    setQuantity(Number(val));
                  }
                }}
                className="max-w-20 px-4 py-2 border border-black outline-none text-center"
              />
              <div
                className="px-4 py-2 border border-black border-l-0 cursor-pointer select-none"
                onClick={() => {
                  const currentQuantity: number = Number(quantity) || 0;
                  setQuantity(currentQuantity + 1);
                }}
              >
                +
              </div>
            </div>
          </div>
          <div className="w-full sm:w-4/5 flex justify-between gap-5">
            <button className="w-full bg-white text-black px-8 py-4 text-sm active:bg-gray-700 cursor-pointer border border-black hover:bg-black hover:text-white" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button className="w-full bg-black text-white px-8 py-4 text-sm active:bg-gray-700 cursor-pointer">
              BUY NOW
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="flex flex-col gap-1 text-sm text-gray-500 mt-5">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and review */}
      <div className="mt-20">
        <div className="flex">
          <button className="cursor-pointer border-black border-t border-l px-5 py-3 text-sm font-bold outline-none bg-black text-white">
            Description
          </button>
          <button className="border-t border-l border-r px-5 py-3 text-sm bg-gray-100 cursor-pointer outline-none">
            Review (122)
          </button>
        </div>
        {/* Mô tả sản phẩm */}
        <div
          className={`relative border text-sm text-gray-600 leading-relaxed`}
        >
          <div
            className={`px-6 py-10 overflow-hidden transition-all duration-700 ease-in-out ${
              showDescription ? "" : "max-h-60"
            }`}
          >
            <div
              className="prose prose-sm max-w-none h-full overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: product.description || "Chưa có mô tả!",
              }}
            ></div>
          </div>
          <div
            className={`absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-white to-transparent pointer-events-none transition-opacity duration-500 ${
              showDescription ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <button
            className="border rounded-2xl outline-none px-3 py-2 absolute left-[50%] bottom-0 -translate-x-[50%] translate-y-[50%] z-10 bg-white text-black cursor-pointer hover:bg-black hover:text-white transition-all ease-in"
            onClick={() => {
              setShowDescription(!showDescription);
            }}
          >
            {showDescription ? "Ẩn bớt" : "Xem thêm"}
          </button>
        </div>
      </div>

      {/* Related Product */}
      <RelatedProduct />
    </div>
  );
};

export default Product;
