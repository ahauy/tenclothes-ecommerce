import Title from "./Title";
import ProductItem from "./ProductItem";
import { useEffect, useState } from "react";
import type { IProduct } from "../interfaces/iProduct";
import { LIMIT_LATEST_COLLECTIONS } from "../constants/paginate";
import api from "../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getLatestProducts() {
      try {
        setIsLoading(true);

        const response = await api.get("/products", {
          params: {
            limit: LIMIT_LATEST_COLLECTIONS,
            sort: "best-selling",
          },
        });

        setBestSeller(response.data.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getLatestProducts();
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1={"BEST"} title2={"SELLER"}></Title>
        <p className="w-3/4 sm:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Tuyển tập những thiết kế đang được săn đón nhất và liên tục cháy hàng
          thời gian qua. Đừng bỏ lỡ cơ hội sở hữu các items được yêu thích nhất
          với chất liệu cao cấp và form dáng chuẩn chỉnh, giúp bạn luôn tự tin
          nổi bật trong mọi khoảnh khắc.
        </p>
      </div>

      <Swiper
        spaceBetween={20} // Khoảng cách giữa các sản phẩm
        slidesPerView={2} // Mặc định hiển thị 2 sản phẩm (cho mobile)
        breakpoints={{
          // Khi màn hình >= 640px (Tablet)
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // Khi màn hình >= 768px (Laptop nhỏ)
          768: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          // Khi màn hình >= 1024px (Desktop)
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {bestSeller.map((product) => (
          <SwiperSlide key={product._id}>
            {isLoading && (
              <>
                <ProductItem isLoading={isLoading} />
              </>
            )}

            {!isLoading && bestSeller.length > 0 && (
              <>
                <ProductItem
                  slug={product.slug}
                  title={product.title}
                  price={product.price}
                  salePrice={product.salePrice}
                  discountPercentage={product.discountPercentage}
                  media={product.media[0]}
                />
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSeller;
