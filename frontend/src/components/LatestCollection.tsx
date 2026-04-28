import Title from "./Title";
import ProductItem from "./ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";
import api from "../utils/axios";
import { LIMIT_LATEST_COLLECTIONS } from "../constants/paginate";
import type { IProduct } from "../interfaces/iProduct";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function getLatestProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get("/products/latest-collection", {
          params: { limit: LIMIT_LATEST_COLLECTIONS },
        });
        setLatestProducts(response.data.data);
      } catch {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
    getLatestProducts();
  }, []);

  return (
    <section className="my-16 sm:my-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
        <div className="text-left">
          <Title title1="MỚI NHẤT" title2="Bộ sưu tập" />
          <p className="text-sm text-neutral-500 mt-4 max-w-md leading-relaxed">
            Những thiết kế vừa ra mắt — kết hợp hoàn hảo giữa phong cách hiện đại
            và chất liệu cao cấp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Custom nav arrows */}
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200 text-neutral-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200 text-neutral-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Link
            to="/collection/all"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
          >
            Xem tất cả
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Grid / Slider */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductItem key={i} isLoading />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-neutral-400 text-sm">{error}</div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 28 },
            1024: { slidesPerView: 4, spaceBetween: 28 },
          }}
        >
          {latestProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductItem
                slug={product.slug}
                title={product.title}
                price={product.price}
                salePrice={product.salePrice}
                discountPercentage={product.discountPercentage}
                media={product.productStyles?.[0]?.images?.[0] || ""}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Mobile "view all" */}
      <div className="flex justify-center mt-8 sm:hidden">
        <Link
          to="/collection/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5"
        >
          Xem tất cả →
        </Link>
      </div>
    </section>
  );
};

export default LatestCollection;
