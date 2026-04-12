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
  const [totalProducts, setTotalProducts] = useState<number>(0);

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
        setTotalProducts(response.data.data.totalProducts);
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
    // Mình bỏ padding dư thừa ở đây vì thường file App.tsx hoặc Layout tổng của bạn đã có padding rồi
    <div className="w-full">
      {/* Đổi md:flex-row thành lg:flex-row. Dưới 1024px, Filter sẽ nằm trên để nhường toàn bộ chiều ngang cho Sản phẩm */}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 pt-6 lg:pt-10">
        {/* Cột Filter: Chỉ cố định width khi lên màn hình lg */}
        <div className="w-full lg:w-64 shrink-0">
          <Filter totalProducts={totalProducts} />
        </div>

        {/* Cột Sản phẩm */}
        <div className="flex-1 min-w-0">
          {/* Header section: Thêm flex-wrap để lỡ có chật thì Dropdown tự rớt xuống chứ không ép bẹp chữ Title */}
          <div className="flex flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-xl sm:text-2xl shrink-0">
              <Title title1={"ALL"} title2={"COLLECTIONS"} />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <DropDown />
            </div>
          </div>

          {/* Product Grid: Ở màn hình nhỏ (như lúc bạn mở DevTools) sẽ ưu tiên 2-3 cột rộng rãi */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
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
