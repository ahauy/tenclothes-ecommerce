import Title from "./Title";
import type { IProduct } from "../assets/assets";
import ProductItem from "./ProductItem";
import { useShopStore } from "../stores/useShopStore";

const LatestCollection = () => {
  const products = useShopStore((state) => state.products)

  const latestProducts: IProduct[] = products.slice(0, 10)


  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1={"LATEST"} title2={"COLLECTIONS"}></Title>
        <p className="w-3/4 sm:w-1/2 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem ut
          labore ad magnam voluptatum quidem, saepe, nostrum reprehenderit
          aperiam modi minus incidunt? Cupiditate nobis tempore placeat magnam
          nisi. Hic, deserunt!
        </p>
      </div>

      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {
          latestProducts.map((product: IProduct) => <>
            <ProductItem key={product._id} title={product.name} media={product.media[0]} price={product.price}></ProductItem>
          </>)
        }
      </div>
    </div>
  );
};

export default LatestCollection;
