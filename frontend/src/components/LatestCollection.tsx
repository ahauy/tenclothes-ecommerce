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

  useEffect(() => {
    async function getLatestProducts() {
      try {
        setIsLoading(true);

        const response = await api.get("/products", {
          params: {
            limit: LIMIT_LATEST_COLLECTIONS,
          },
        });

        setLatestProducts(response.data.data.products);
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
        <Title title1={"LATEST"} title2={"COLLECTIONS"}></Title>
        <p className="w-3/4 sm:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Khám phá những thiết kế mới nhất trong bộ sưu tập mùa này của chúng
          tôi. Mỗi sản phẩm đều là sự kết hợp hoàn hảo giữa phong cách hiện đại
          và sự tinh tế, giúp bạn khẳng định phong cách riêng.
        </p>
      </div>

      {/* Rendering products */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {latestProducts.map((product: IProduct) => (
          <>
            <ProductItem
              key={product._id}
              title={product.name}
              media={product.media[0]}
              price={product.price}
            ></ProductItem>
          </>
        ))}
      </div> */}
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
        {latestProducts.map((product) => (
          <SwiperSlide key={product._id}>
            {isLoading && (
              <>
                <ProductItem isLoading={isLoading} />
              </>
            )}

            {!isLoading && latestProducts.length > 0 && (
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

export default LatestCollection;
