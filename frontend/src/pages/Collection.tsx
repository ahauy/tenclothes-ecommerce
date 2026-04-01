import { useEffect, useState } from "react";
import DropDown from "../components/DropDown";
import Filter from "../components/Filter";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import api from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { LIMIT_PAGE } from "../constants/paginate";
import type { IProduct } from "../interfaces/iProduct";

const Collection = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0)

  const [params, setParams] = useSearchParams();
  const currentPage: number = Number(params.get("page")) || 1;

  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await api.get("/products", {
          params: {
            ...Object.fromEntries(params),
            limit: LIMIT_PAGE,
          },
        });
        setProducts(response.data.data.products);
        setTotalProducts(response.data.data.totalProducts)
        setTotalPages(response.data.data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProducts();
  }, [params]);

  const handlePageClick = (event: { selected: number }) => {
    const newPage: number = event.selected + 1;
    const newParams = new URLSearchParams(params);
    newParams.set("page", newPage.toString());
    setParams(newParams);
  };

  return (
    // Thêm padding px-4 để không dính sát viền màn hình
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row gap-6 lg:gap-10 pt-6 lg:pt-10">
        {/* Cột Filter */}
        <div className="w-full md:w-56 lg:w-64 shrink-0">
          <Filter totalProducts={totalProducts}/>
        </div>

        {/* Cột Sản phẩm */}
        <div className="flex-1 min-w-0">
          {/* Header section: Chuyển flex-col trên mobile để dropdown không bị ép */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-xl sm:text-2xl">
              <Title title1={"ALL"} title2={"COLLECTIONS"} />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <DropDown />
            </div>
          </div>

          {/* Product Grid: Giữ 2 cột trên md, đẩy lên 3 cột từ màn lg */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {isLoading && (
              <>
                {new Array(8).fill(0).map((_, index) => (
                  <ProductItem key={index} isLoading={isLoading} />
                ))}
              </>
            )}

            {!isLoading && products.length > 0 && (
              <>
                {products.map((product) => (
                  <ProductItem
                    key={product._id}
                    slug={product.slug}
                    title={product.title}
                    price={product.price}
                    salePrice={product.salePrice}
                    discountPercentage={product.discountPercentage}
                    media={product.media[0]}
                  />
                ))}
              </>
            )}
          </div>

          {/* Phân trang */}
          <ReactPaginate
            breakLabel="..."
            nextLabel="Tiếp >"
            previousLabel="< Trước"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            forcePage={currentPage - 1}
            containerClassName="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-10 mb-8 text-sm"
            pageClassName="block border border-gray-300 rounded hover:bg-black hover:text-white transition"
            pageLinkClassName="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
            previousClassName="block border border-gray-300 rounded hover:bg-black hover:text-white transition"
            previousLinkClassName="px-3 sm:px-4 h-8 sm:h-10 flex items-center justify-center cursor-pointer"
            nextClassName="block border border-gray-300 rounded hover:bg-black hover:text-white transition"
            nextLinkClassName="px-3 sm:px-4 h-8 sm:h-10 flex items-center justify-center cursor-pointer"
            breakClassName="block text-gray-500"
            breakLinkClassName="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
            activeClassName="bg-black text-white hover:bg-black border-black"
            activeLinkClassName="text-white"
            disabledClassName="opacity-50 select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;
