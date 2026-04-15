import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import DropDown from "../components/DropDown";
import Filter from "../components/Filter";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import api from "../utils/axios";
import ReactPaginate from "react-paginate";
import { LIMIT_PAGE } from "../constants/paginate";
import type { IProduct } from "../interfaces/iProduct";
import { useCategoryStore } from "../stores/useCategoryStore";
import type { ICategoryTree } from "../interfaces/iCategoryTree";
import { findPath } from "../utils/findPath";
import type { IDynamicFilters } from "../interfaces/iDynamicFilters";

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const [params, setParams] = useSearchParams();
  const currentPage: number = Number(params.get("page")) || 1;

  // lấy từ khóa tìm kiếm
  const keyword: string = params.get("keyword") || "";

  // Lấy cây thư mục từ Zustand
  const categoryTree: ICategoryTree[] = useCategoryStore((s) => s.categoryTree);

  const [dynamicFilters, setDynamicFilters] = useState<IDynamicFilters>({
    sizes: [],
    colors: [],
  });

  // State cho Breadcrumb và Danh mục con
  const [categoryPath, setCategoryPath] = useState<ICategoryTree[]>([]);
  const [childCategories, setChildCategories] = useState<ICategoryTree[]>([]);

  // Effect xử lý Breadcrumbs và Child Categories
  useEffect(() => {
    if (keyword) {
      setCategoryPath([]);
      setChildCategories([]);
      return;
    }

    if (categoryTree.length > 0 && slug) {
      const path = findPath(categoryTree, slug);
      if (path) {
        setCategoryPath(path);
        // Lấy danh mục cuối cùng trong mảng path (chính là danh mục hiện tại)
        const currentCategory = path[path.length - 1];
        setChildCategories(currentCategory.children || []);
      } else {
        setCategoryPath([]);
        setChildCategories([]);
      }
    }
  }, [categoryTree, slug, keyword]);

  // Lấy bộ lọc động
  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await api.get(`/products/category/${slug}/filters`, {
          params: { keyword: keyword },
        });
        if (response.data.status) {
          setDynamicFilters(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bộ lọc động:", error);
      }
    }
    if (slug) fetchFilters();
  }, [slug, keyword]);

  // Effect lấy sản phẩm
  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/category/${slug}`, {
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
    if (slug) getProducts();
  }, [params, slug]);

  const handlePageClick = (event: { selected: number }) => {
    const newPage: number = event.selected + 1;
    const newParams = new URLSearchParams(params);
    newParams.set("page", newPage.toString());
    setParams(newParams);
  };

  return (
    <div className="w-full">
      {/* 1. ĐƯỜNG DẪN BREADCRUMB */}
      <div className="w-full bg-[#f8f9fa] py-3 mb-6 px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          {keyword ? (
            <span className="flex items-center gap-2">
              <span>/</span>
              <span className="text-black font-medium">Tìm kiếm</span>
            </span>
          ) : (
            categoryPath.map((cat, index) => (
              <span key={cat._id} className="flex items-center gap-2">
                <span>/</span>
                <Link
                  to={`/collection/${cat.slug}`}
                  className={`hover:text-black transition-colors ${
                    index === categoryPath.length - 1
                      ? "text-black font-medium"
                      : ""
                  }`}
                >
                  {cat.title}
                </Link>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="">
        {/* 2. DANH MỤC CON (Ẩn đi nếu đang ở chế độ tìm kiếm) */}
        {!keyword && childCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {/* Nội dung childCategories giữ nguyên */}
          </div>
        )}

        {/* 3. LAYOUT LỌC & SẢN PHẨM */}
        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Cột Filter */}
          <div className="w-full lg:w-64 shrink-0">
            <Filter
              totalProducts={totalProducts}
              dynamicFilters={dynamicFilters}
            />
          </div>

          {/* Cột Sản phẩm */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
              {/* TÙY BIẾN TITLE */}
              <div className="text-xl sm:text-2xl shrink-0">
                <Title
                  title1={
                    keyword
                      ? `TÌM KIẾM: "${keyword}"`
                      : categoryPath[categoryPath.length - 1]?.title ||
                        "TẤT CẢ SẢN PHẨM"
                  }
                  title2={""}
                />
              </div>

              <div className="w-full sm:w-auto flex justify-end">
                <DropDown />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {isLoading &&
                new Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <ProductItem key={index} isLoading={isLoading} />
                  ))}

              {!isLoading && products.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Không tìm thấy sản phẩm nào phù hợp.
                </div>
              )}

              {!isLoading &&
                products.map((product) => (
                  <ProductItem
                    key={product._id}
                    slug={product.slug}
                    title={product.title}
                    price={product.price}
                    salePrice={product.salePrice}
                    discountPercentage={product.discountPercentage}
                    media={product.productStyles?.[0]?.images?.[0] || ""}
                  />
                ))}
            </div>

            {/* Phân trang (Giữ nguyên của bạn) */}
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
    </div>
  );
};

export default Collection;
