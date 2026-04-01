import type { IProduct } from "../assets/assets";
import { useShopStore } from "../stores/useShopStore";
import ProductItem from "./ProductItem";
import Title from "./Title";


const RelatedProduct = () => {

  const products = useShopStore((state) => state.products)


  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1={"RELATED"} title2={"PRODUCTS"}/>
      </div>

      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {products.slice(0, 5).map((product: IProduct) => (
          <>
            <ProductItem
              key={product._id}
              title={product.name}
              media={"aaaa"}
              price={product.price}
            ></ProductItem>
          </>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;