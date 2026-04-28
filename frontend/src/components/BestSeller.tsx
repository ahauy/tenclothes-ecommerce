import Title from "./Title";
import ProductItem from "./ProductItem";
import { useEffect, useState } from "react";
import type { IProduct } from "../interfaces/iProduct";
import { LIMIT_LATEST_COLLECTIONS } from "../constants/paginate";
import api from "../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        setIsLoading(true);
        const response = await api.get("/products/best-selling", {
          params: { limit: LIMIT_LATEST_COLLECTIONS },
        });
        setBestSeller(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBestSellers();
  }, []);

  return (
    <section className="my-16 sm:my-24">
      {/* Accent strip */}
      <div className="w-full h-px bg-neutral-100 mb-16" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
        <div className="text-left">
          <Title title1="BÁN CHẠY NHẤT" title2="Được yêu thích" />
          <p className="text-sm text-neutral-500 mt-4 max-w-md leading-relaxed">
            Những sản phẩm đang được săn đón nhất — chất liệu cao cấp,
            form dáng chuẩn, được hàng nghìn khách hàng tin chọn.
          </p>
        </div>

        <Link
          to="/collection/all"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
        >
          Khám phá thêm
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Slider */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 28 },
          1024: { slidesPerView: 4, spaceBetween: 28 },
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={i}>
                <ProductItem isLoading />
              </SwiperSlide>
            ))
          : bestSeller.map((product) => (
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

      {/* Mobile "view all" */}
      <div className="flex justify-center mt-8 sm:hidden">
        <Link
          to="/collection/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5"
        >
          Khám phá thêm →
        </Link>
      </div>
    </section>
  );
};

export default BestSeller;
