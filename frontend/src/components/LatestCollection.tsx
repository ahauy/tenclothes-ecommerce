import Title from "./Title";
import ProductItem from "./ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { LIMIT_LATEST_COLLECTIONS } from "../constants/paginate";
import type { IProduct } from "../interfaces/iProduct";

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getLatestProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get("/products/latest-collection", {
          params: {
            limit: LIMIT_LATEST_COLLECTIONS,
          },
        });

        setLatestProducts(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setError(
          "Không thể tải danh sách sản phẩm lúc này. Vui lòng kiểm tra lại kết nối hoặc phân quyền."
        );
      } finally {
        setIsLoading(false);
      }
    }

    getLatestProducts();
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1={"LATEST"} title2={"COLLECTIONS"}></Title>
        <p className="w-3/4 sm:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Khám phá những thiết kế mới nhất trong bộ sưu tập mùa này của chúng
          tôi. Mỗi sản phẩm đều là sự kết hợp hoàn hảo giữa phong cách hiện đại
          và sự tinh tế, giúp bạn khẳng định phong cách riêng.
        </p>
      </div>

      {/* ĐIỀU KIỆN 1: ĐANG LOADING CHƯA CÓ DATA */}
      {isLoading ? (
        // Dùng CSS Grid khớp 100% với breakpoint của Swiper bên dưới
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <ProductItem isLoading={true} />
            </div>
          ))}
        </div>
      ) : /* ĐIỀU KIỆN 2: LOAD XONG NHƯNG BỊ LỖI API (VÍ DỤ LỖI 401) */
      error ? (
        <div className="text-center text-red-500 py-10 font-medium">
          {error}
        </div>
      ) : (
        /* ĐIỀU KIỆN 3: LOAD XONG VÀ THÀNH CÔNG -> HIỂN THỊ SWIPER */
        <Swiper
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
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
    </div>
  );
};

export default LatestCollection;
