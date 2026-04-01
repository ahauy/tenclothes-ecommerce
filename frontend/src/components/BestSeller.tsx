import Title from "./Title";
import type { IProduct } from "../assets/assets";
import ProductItem from "./ProductItem";
import { useShopStore } from "../stores/useShopStore";

const BestSeller = () => {

  const products = useShopStore((state) => state.products)

  const bestSellerProduct: IProduct[] = products.filter((item) => item.bestseller).slice(0, 5);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1={"BEST"} title2={"SELLER"}></Title>
        <p className="w-3/4 sm:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
          ratione, officia eaque pariatur ab culpa voluptatibus numquam, ut
          quaerat placeat laudantium veritatis dignissimos labore. Saepe modi
          atque laborum ullam non.
        </p>
      </div>

      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {bestSellerProduct.map((product: IProduct) => (
          <>
            <ProductItem
              key={product._id}
              title={product.name}
              media={product.media[0]}
              price={product.price}
            ></ProductItem>
          </>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
