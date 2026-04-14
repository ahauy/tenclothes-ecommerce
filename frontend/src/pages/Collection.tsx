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

  // Lấy cây thư mục từ Zustand
  const categoryTree: ICategoryTree[] = useCategoryStore((s) => s.categoryTree);

  const [dynamicFilters, setDynamicFilters] = useState<IDynamicFilters>({ sizes: [], colors: [] });

  // State cho Breadcrumb và Danh mục con
  const [categoryPath, setCategoryPath] = useState<ICategoryTree[]>([]);
  const [childCategories, setChildCategories] = useState<ICategoryTree[]>([]);

  // Effect xử lý Breadcrumbs và Child Categories
  useEffect(() => {
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
  }, [categoryTree, slug]);

  // Lấy bộ lọc động
  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await api.get(`/products/category/${slug}/filters`);
        if (response.data.status) {
          setDynamicFilters(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bộ lọc động:", error);
      }
    }
    if (slug) fetchFilters();
  }, [slug]);

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
          {categoryPath.map((cat, index) => (
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
          ))}
        </div>
      </div>

      <div className="">
        {/* 2. DANH MỤC CON (Hiển thị như ảnh) */}
        {childCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {childCategories.map((child) => (
              <Link
                to={`/collection/${child.slug}`}
                key={child._id}
                className="flex flex-col items-center bg-[#f4f4f4] hover:bg-[#e9e9e9] transition-colors p-6 rounded-sm group"
              >
                <div className="w-full aspect-4/3 flex items-center justify-center overflow-hidden mix-blend-multiply">
                  <img
                    src={
                      child.thumbnail || "https://via.placeholder.com/200x200"
                    }
                    alt={child.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-4 font-bold text-gray-800 text-sm md:text-base">
                  {child.title}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* 3. LAYOUT LỌC & SẢN PHẨM */}
        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Cột Filter */}
          <div className="w-full lg:w-64 shrink-0">
            <Filter totalProducts={totalProducts} dynamicFilters={dynamicFilters}/>
          </div>

          {/* Cột Sản phẩm */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-xl sm:text-2xl shrink-0">
                <Title
                  title1={categoryPath[categoryPath.length - 1]?.title || "ALL"}
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
