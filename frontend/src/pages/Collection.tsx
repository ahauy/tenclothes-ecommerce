import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import DropDown from "../components/DropDown";
import Filter from "../components/Filter";
import ProductItem from "../components/ProductItem";
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
  const keyword: string = params.get("keyword") || "";

  const categoryTree: ICategoryTree[] = useCategoryStore((s) => s.categoryTree);

  const [dynamicFilters, setDynamicFilters] = useState<IDynamicFilters>({
    sizes: [],
    colors: [],
  });

  const [categoryPath, setCategoryPath] = useState<ICategoryTree[]>([]);
  const [childCategories, setChildCategories] = useState<ICategoryTree[]>([]);

  useEffect(() => {
    if (keyword) { setCategoryPath([]); setChildCategories([]); return; }
    if (categoryTree.length > 0 && slug) {
      const path = findPath(categoryTree, slug);
      if (path) {
        setCategoryPath(path);
        setChildCategories(path[path.length - 1].children || []);
      } else {
        setCategoryPath([]);
        setChildCategories([]);
      }
    }
  }, [categoryTree, slug, keyword]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await api.get(`/products/category/${slug}/filters`, {
          params: { keyword },
        });
        if (response.data.status) setDynamicFilters(response.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy bộ lọc động:", err);
      }
    }
    if (slug) fetchFilters();
  }, [slug, keyword]);

  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/category/${slug}`, {
          params: { ...Object.fromEntries(params), limit: LIMIT_PAGE },
        });
        setProducts(response.data.data.products);
        setTotalProducts(response.data.data.totalProducts);
        setTotalPages(response.data.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) getProducts();
  }, [params, slug]);

  const handlePageClick = (event: { selected: number }) => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", String(event.selected + 1));
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTitle = keyword
    ? `Kết quả cho "${keyword}"`
    : categoryPath[categoryPath.length - 1]?.title || "Tất cả sản phẩm";

  return (
    <div className="w-full min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 py-5">
        <Link to="/" className="hover:text-black transition-colors">
          Trang chủ
        </Link>
        {keyword ? (
          <>
            <span>/</span>
            <span className="text-black font-medium">Tìm kiếm</span>
          </>
        ) : (
          categoryPath.map((cat, i) => (
            <span key={cat._id} className="flex items-center gap-2">
              <span>/</span>
              <Link
                to={`/collection/${cat.slug}`}
                className={`hover:text-black transition-colors ${
                  i === categoryPath.length - 1 ? "text-black font-medium" : ""
                }`}
              >
                {cat.title}
              </Link>
            </span>
          ))
        )}
      </div>

      {/* ── Child categories ── */}
      {!keyword && childCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {/* giữ nguyên nội dung childCategories */}
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* Filter sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <Filter totalProducts={totalProducts} dynamicFilters={dynamicFilters} />
        </aside>

        {/* Product column */}
        <div className="flex-1 min-w-0">

          {/* Top bar: title + sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-neutral-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-black prata-regular">
                {pageTitle}
              </h1>
              {!isLoading && (
                <p className="text-xs text-neutral-400 mt-1">
                  {totalProducts} sản phẩm
                </p>
              )}
            </div>
            <DropDown />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <ProductItem key={i} isLoading />
              ))}

            {!isLoading && products.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
                <svg className="w-14 h-14 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-base font-semibold text-black">Không tìm thấy sản phẩm</p>
                <p className="text-sm text-neutral-400">Thử thay đổi bộ lọc hoặc từ khoá khác nhé.</p>
                <Link
                  to="/collection/all"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
                >
                  Xem tất cả sản phẩm →
                </Link>
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

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <ReactPaginate
              breakLabel="…"
              nextLabel={
                <span className="flex items-center gap-1">
                  Tiếp
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              }
              previousLabel={
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Trước
                </span>
              }
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              forcePage={currentPage - 1}
              containerClassName="flex flex-wrap justify-center items-center gap-1.5 mt-14 mb-8 text-sm select-none"
              pageClassName="block"
              pageLinkClassName="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors cursor-pointer"
              previousClassName="block"
              previousLinkClassName="h-9 px-4 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors cursor-pointer gap-1"
              nextClassName="block"
              nextLinkClassName="h-9 px-4 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors cursor-pointer gap-1"
              breakClassName="block"
              breakLinkClassName="w-9 h-9 flex items-center justify-center text-neutral-400"
              activeClassName="[&>a]:bg-black [&>a]:text-white [&>a]:border-black"
              disabledClassName="opacity-40 pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
