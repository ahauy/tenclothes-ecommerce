import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  ChevronDown,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Check,
  Zap,
  Layers,
  Activity,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import type { IProductAdmin } from "../interfaces/product.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import ProductDrawer from "../components/ProductDrawer";
import type { IJsonFail } from "../interfaces/api.interface";
// import ReactPaginateLib from "react-paginate";
// import ReactPaginate from 'react-paginate';
import ReactPaginateLib from "react-paginate";
const ReactPaginate: any = (ReactPaginateLib as any).default || ReactPaginateLib;

// const ReactPaginate =
//   (ReactPaginateLib as unknown as { default: unknown }).default ||
//   ReactPaginateLib;

interface DropdownProps<T extends string | number | boolean> {
  options: { label: string; value: T; icon?: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const CustomDropdown = <T extends string | number | boolean>({
  options,
  value,
  onChange,
  placeholder,
  icon,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1 min-w-[150px]" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-2.5 bg-neutral-50/50 border border-neutral-200 text-[11px] font-semibold tracking-wide transition-all duration-300 w-full group hover:border-neutral-400 hover:bg-white rounded-md",
          isOpen &&
            "border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900/5",
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && (
            <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors flex-shrink-0">
              {icon}
            </span>
          )}
          <span
            className={cn(
              "truncate",
              selectedOption?.value !== "all"
                ? "text-neutral-900"
                : "text-neutral-500",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180 text-neutral-900",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-md shadow-xl shadow-neutral-900/5 z-50 overflow-hidden min-w-[220px]"
          >
            <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {option.icon && (
                      <span
                        className={cn(
                          "transition-colors flex-shrink-0",
                          value === option.value
                            ? "text-neutral-900"
                            : "text-neutral-400 group-hover:text-neutral-700",
                        )}
                      >
                        {option.icon}
                      </span>
                    )}
                    <span
                      className={cn(
                        "truncate",
                        value === option.value
                          ? "text-neutral-900 font-semibold"
                          : "text-neutral-600 group-hover:text-neutral-900",
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && (
                    <Check className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrashProducts: React.FC = () => {
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProductAdmin | null>(
    null,
  );
  const [productToRestore, setProductToRestore] = useState<{
    id: string;
    title: string;
    slug: string;
  } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        page,
        limit: 8,
        keyword: searchTerm,
        isActive:
          activeFilter === "active"
            ? true
            : activeFilter === "inactive"
              ? false
              : undefined,
        isFeatured:
          featuredFilter === "featured"
            ? true
            : featuredFilter === "normal"
              ? false
              : undefined,
        categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        isTrash: "true",
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (error: unknown) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    searchTerm,
    activeFilter,
    featuredFilter,
    categoryFilter,
    startDate,
    endDate,
  ]); // Đưa toàn bộ state phụ thuộc vào đây

  const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      setProducts((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, isActive: newStatus } : p)),
      );

      await productService.changeStatus(slug, newStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Failed to update status", error);
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isActive: currentStatus } : p,
        ),
      );
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleToggleFeatured = async (
    slug: string,
    currentFeatured: boolean,
  ) => {
    try {
      const newFeatured = !currentFeatured;
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isFeatured: newFeatured } : p,
        ),
      );

      await productService.changeFeatured(slug, newFeatured);
      toast.success("Cập nhật sản phẩm nổi bật thành công");
    } catch (error) {
      console.error("Failed to update featured status", error);
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isFeatured: currentFeatured } : p,
        ),
      );
      toast.error("Không thể cập nhật sản phẩm nổi bật");
    }
  };

  const handleRestoreProduct = async () => {
    if (!productToRestore) return;
    setIsRestoring(true);
    try {
      await productService.restoreProduct(productToRestore.slug);
      toast.success(`Đã khôi phục sản phẩm "${productToRestore.title}"`);
      setProductToRestore(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to restore product", error);
      toast.error("Không thể khôi phục sản phẩm. Vui lòng thử lại!");
    } finally {
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        type ICategoryRaw = {
          _id: string;
          title: string;
          level: number;
          children?: ICategoryRaw[];
        };
        type ICategoryFlat = { _id: string; title: string };

        const flattenCategories = (cats: ICategoryRaw[]): ICategoryFlat[] => {
          let result: ICategoryFlat[] = [];
          if (!Array.isArray(cats)) return result;
          cats.forEach((cat) => {
            result.push({
              _id: cat._id,
              title: `${cat.level > 1 ? "└ ".repeat(cat.level - 1) : ""}${cat.title}`,
            });
            if (cat.children && cat.children.length > 0) {
              result = result.concat(flattenCategories(cat.children));
            }
          });
          return result;
        };
        setCategories(flattenCategories(res.data || []));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch categories", error.message);
        } else {
          console.error("Failed to fetch categories", String(error));
        }
      }
    };

    fetchCategories();
  }, []); // Mảng rỗng chuẩn xác vì không phụ thuộc vào state nào bên ngoài

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
    };

    loadData();
  }, [fetchProducts]); // Giờ mảng deps chỉ cần phụ thuộc vào mỗi fetchProducts

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setActiveFilter("all");
    setFeaturedFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  const activeFilterOptions = [
    {
      label: "Tất cả trạng thái",
      value: "all",
      icon: <Activity className="w-3.5 h-3.5" />,
    },
    {
      label: "Đang hoạt động",
      value: "active",
      icon: <Check className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      label: "Đang ẩn",
      value: "inactive",
      icon: <X className="w-3.5 h-3.5 text-neutral-400" />,
    },
  ];

  const featuredFilterOptions = [
    {
      label: "Tất cả loại hàng",
      value: "all",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      label: "Sản phẩm nổi bật",
      value: "featured",
      icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      label: "Sản phẩm thường",
      value: "normal",
      icon: <Package className="w-3.5 h-3.5" />,
    },
  ];

  const categoryOptions = [
    {
      label: "Tất cả danh mục",
      value: "all",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    ...categories.map((cat) => ({
      label: cat.title,
      value: cat._id,
    })),
  ];

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full pb-10 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full px-2 sm:px-0">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              QUẢN LÝ DỮ LIỆU
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
              Thùng rác
            </h2>
            <p className="text-neutral-500 font-medium text-sm hidden md:block">
              Xem và khôi phục các sản phẩm đã xoá.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-4">
          {/* Top Row: Search */}
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên, mã SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-md pl-10 pr-4 py-2.5 text-[12px] font-medium outline-none focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900/5 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-md hover:border-neutral-400 hover:bg-white transition-colors flex-1 min-w-[240px] xl:flex-none">
              <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div className="flex items-center w-full group">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 cursor-pointer"
                  title="Từ ngày"
                />
                <span className="text-neutral-300 text-xs px-2">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 cursor-pointer"
                  title="Đến ngày"
                />
              </div>
            </div>

            <CustomDropdown
              placeholder="Trạng thái"
              options={activeFilterOptions}
              value={activeFilter}
              onChange={setActiveFilter}
              icon={<Activity className="w-4 h-4" />}
            />
            <CustomDropdown
              placeholder="Phân loại"
              options={featuredFilterOptions}
              value={featuredFilter}
              onChange={setFeaturedFilter}
              icon={<Zap className="w-4 h-4" />}
            />
            <CustomDropdown
              placeholder="Danh mục"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              icon={<Layers className="w-4 h-4" />}
            />

            {/* Reset Filters Icon Button */}
            {(searchTerm ||
              startDate ||
              endDate ||
              activeFilter !== "all" ||
              featuredFilter !== "all" ||
              categoryFilter !== "all") && (
              <button
                onClick={resetFilters}
                title="Xóa tất cả lọc"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 rounded-md transition-colors text-[11px] font-bold uppercase tracking-wider flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0"
              >
                <X className="w-3.5 h-3.5" />
                <span className="lg:hidden">Xóa Bộ Lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Presentation */}
        <div className="w-full min-h-[400px]">
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {isLoading && products.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 border border-neutral-100 rounded-xl animate-pulse h-48"
                  />
                ))
              : products.length > 0
                ? products.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: isLoading ? 0.6 : 1, y: 0 }}
                      key={product._id}
                      className="bg-white p-4 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group flex flex-col"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="w-20 h-24 bg-neutral-50 rounded-md border border-neutral-100 flex-shrink-0 overflow-hidden relative">
                          {product.productStyles?.[0]?.images?.[0] ? (
                            <img
                              src={product.productStyles[0].images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <Package className="w-6 h-6 stroke-1" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4
                            className="text-[12px] font-bold uppercase text-neutral-900 truncate mb-1"
                            title={product.title}
                          >
                            {product.title}
                          </h4>
                          <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                            SKU: {product.variants?.[0]?.sku || "N/A"}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-neutral-900 tabular-nums">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-[9px] text-red-500 font-bold bg-red-50 px-1 rounded-sm">
                                -{product.discountPercentage}%
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-[8px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-[3px] truncate max-w-[100px]">
                              {product.categoryIds?.[0]?.title ||
                                "CHƯA PHÂN LOẠI"}
                            </span>
                            {product.isFeatured && (
                              <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-[3px]">
                                NỔI BẬT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-3 border-t border-neutral-100 mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            {/* Status Toggle */}
                            <div className="flex items-center gap-2">
                              <div
                                onClick={() =>
                                  handleToggleStatus(
                                    product.slug,
                                    product.isActive,
                                  )
                                }
                                className={cn(
                                  "w-8 h-4.5 p-0.5 rounded-full transition-colors duration-300 cursor-pointer border shadow-inner relative",
                                  product.isActive
                                    ? "bg-emerald-500 border-emerald-600"
                                    : "bg-neutral-200 border-neutral-300",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm border border-neutral-100",
                                    product.isActive
                                      ? "translate-x-[14px]"
                                      : "translate-x-0",
                                  )}
                                />
                              </div>
                              <span className="text-[9px] font-semibold text-neutral-500">
                                HIỂN THỊ
                              </span>
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center gap-2">
                              <div
                                onClick={() =>
                                  handleToggleFeatured(
                                    product.slug,
                                    product.isFeatured,
                                  )
                                }
                                className={cn(
                                  "w-8 h-4.5 p-0.5 rounded-full transition-colors duration-300 cursor-pointer border shadow-inner relative",
                                  product.isFeatured
                                    ? "bg-amber-500 border-amber-600"
                                    : "bg-neutral-200 border-neutral-300",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm border border-neutral-100",
                                    product.isFeatured
                                      ? "translate-x-[14px]"
                                      : "translate-x-0",
                                  )}
                                />
                              </div>
                              <span className="text-[9px] font-semibold text-neutral-500">
                                NỔI BẬT
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setProductToRestore({
                                id: product._id,
                                title: product.title,
                                slug: product.slug,
                              });
                            }}
                            title="Khôi phục"
                            className="flex-1 flex items-center justify-center p-2 border border-emerald-200 rounded-md hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all text-emerald-500 gap-2"
                          >
                            <RefreshCcw className="w-4 h-4" />{" "}
                            <span className="text-[10px] uppercase font-bold tracking-widest">
                              Khôi phục
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                : !isLoading && (
                    <div className="col-span-full py-20 text-center text-[11px] font-semibold text-neutral-400 tracking-wider">
                      Không tìm thấy sản phẩm nào phù hợp
                    </div>
                  )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden lg:block bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="w-[30%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Sản Phẩm
                  </th>
                  <th className="w-[15%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Phân Loại
                  </th>
                  <th className="w-[15%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Giá Niêm Yết
                  </th>
                  <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">
                    Tồn Kho
                  </th>
                  <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">
                    Hiển Thị
                  </th>
                  <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">
                    Nổi Bật
                  </th>
                  <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 min-h-[480px]">
                {isLoading && products.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={7} className="px-6 py-4 h-[90px]">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-16 bg-neutral-100 rounded-md" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-neutral-100 w-2/3 rounded-sm" />
                              <div className="h-2 bg-neutral-100 w-1/3 rounded-sm" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : products.length > 0
                    ? products.map((product) => (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isLoading ? 0.5 : 1 }}
                          exit={{ opacity: 0 }}
                          key={product._id}
                          className="group hover:bg-neutral-50/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-16 bg-neutral-50 rounded-md overflow-hidden relative border border-neutral-200 flex-shrink-0">
                                {product.productStyles?.[0]?.images?.[0] ? (
                                  <img
                                    src={product.productStyles[0].images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    <Package className="w-5 h-5 stroke-1" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 pr-2">
                                <h4
                                  className="text-[12px] font-bold text-neutral-900 uppercase truncate mb-1"
                                  title={product.title}
                                >
                                  {product.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded-[3px]">
                                    SKU: {product.variants?.[0]?.sku || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <span
                                className="text-[11px] font-semibold text-neutral-700 uppercase truncate"
                                title={product.categoryIds
                                  ?.map((c) => c.title)
                                  .join(", ")}
                              >
                                {product.categoryIds?.[0]?.title ||
                                  "CHƯA PHÂN LOẠI"}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                                {product.gender}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-neutral-900 tabular-nums">
                                ${product.price.toLocaleString()}
                              </span>
                              {product.discountPercentage > 0 && (
                                <span className="text-[10px] text-red-500 font-semibold tracking-wide">
                                  -{product.discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={cn(
                                  "text-[12px] font-bold tabular-nums",
                                  product.totalStock <= 5
                                    ? "text-red-500"
                                    : "text-neutral-900",
                                )}
                              >
                                {product.totalStock}
                              </span>
                              <div
                                className={cn(
                                  "w-6 h-1 mt-1.5 rounded-full",
                                  product.totalStock <= 5
                                    ? "bg-red-200"
                                    : "bg-emerald-200",
                                )}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div
                                onClick={() =>
                                  handleToggleStatus(
                                    product.slug,
                                    product.isActive,
                                  )
                                }
                                className={cn(
                                  "w-10 h-5.5 p-0.5 rounded-full transition-colors duration-300 cursor-pointer border shadow-inner relative group/toggle",
                                  product.isActive
                                    ? "bg-emerald-500 border-emerald-600"
                                    : "bg-neutral-200 border-neutral-300",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm border border-neutral-100",
                                    product.isActive
                                      ? "translate-x-[18px]"
                                      : "translate-x-0",
                                  )}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div
                                onClick={() =>
                                  handleToggleFeatured(
                                    product.slug,
                                    product.isFeatured,
                                  )
                                }
                                className={cn(
                                  "w-10 h-5.5 p-0.5 rounded-full transition-colors duration-300 cursor-pointer border shadow-inner relative group/toggle",
                                  product.isFeatured
                                    ? "bg-amber-500 border-amber-600"
                                    : "bg-neutral-200 border-neutral-300",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm border border-neutral-100",
                                    product.isFeatured
                                      ? "translate-x-[18px]"
                                      : "translate-x-0",
                                  )}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setProductToRestore({
                                    id: product._id,
                                    title: product.title,
                                    slug: product.slug,
                                  });
                                }}
                                title="Khôi phục"
                                className="p-2 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors rounded-md border border-transparent hover:border-emerald-100 flex items-center gap-2"
                              >
                                <RefreshCcw className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">
                                  Khôi phục
                                </span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    : !isLoading && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-24 text-center text-[12px] font-semibold text-neutral-400 tracking-wider"
                          >
                            Không tìm thấy sản phẩm nào phù hợp
                          </td>
                        </tr>
                      )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border border-neutral-200 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 w-full shadow-sm">
          <div className="text-[11px] text-neutral-500 font-medium order-2 sm:order-1 flex items-center gap-2">
            <span>
              Hiển thị{" "}
              <span className="font-bold text-neutral-900">
                {(page - 1) * 8 + (totalProducts > 0 ? 1 : 0)}
              </span>{" "}
              -{" "}
              <span className="font-bold text-neutral-900">
                {Math.min(page * 8, totalProducts)}
              </span>{" "}
              trong số{" "}
              <span className="font-bold text-neutral-900">
                {totalProducts}
              </span>{" "}
              sản phẩm
            </span>
          </div>

          {totalPages > 1 && (
            <div className="order-1 sm:order-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<ChevronRight className="w-4 h-4" />}
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={totalPages}
                forcePage={page - 1}
                previousLabel={<ChevronLeft className="w-4 h-4" />}
                renderOnZeroPageCount={null}
                containerClassName="flex items-center gap-1.5 w-max mx-auto sm:mx-0"
                pageClassName="min-w-[32px] h-8 flex items-center justify-center transition-colors duration-200 border border-transparent hover:bg-neutral-100 text-[11px] font-semibold text-neutral-600 rounded-md"
                pageLinkClassName="w-full h-full flex items-center justify-center px-2 outline-none cursor-pointer"
                activeClassName="!bg-neutral-900 !text-white hover:!bg-neutral-800"
                activeLinkClassName="w-full h-full flex items-center justify-center text-white cursor-default"
                previousClassName="h-8 px-2 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center rounded-md border border-transparent"
                previousLinkClassName="w-full h-full flex items-center justify-center px-1 outline-none cursor-pointer"
                nextClassName="h-8 px-2 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center rounded-md border border-transparent"
                nextLinkClassName="w-full h-full flex items-center justify-center px-1 outline-none cursor-pointer"
                disabledClassName="opacity-30 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 pointer-events-none"
                breakClassName="min-w-[32px] h-8 flex items-center justify-center text-[11px] font-semibold text-neutral-400"
                breakLinkClassName="w-full h-full flex items-center justify-center outline-none cursor-default"
              />
            </div>
          )}
        </div>

        <ProductDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setProductToEdit(null);
          }}
          onSuccess={() => {
            setIsDrawerOpen(false);
            setProductToEdit(null);
            fetchProducts();
          }}
          productToEdit={productToEdit}
        />
      </div>

      {/* Restore Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {productToRestore && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isRestoring && setProductToRestore(null)}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[9999] transition-all duration-300"
              />
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                  className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-md p-6 pointer-events-auto"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                      <RefreshCcw className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Khôi phục sản phẩm
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Bạn có chắc chắn muốn khôi phục sản phẩm <br />
                        <span className="font-bold text-neutral-900">
                          "{productToRestore.title}"
                        </span>
                        ? <br />
                        Sản phẩm sẽ được hiển thị lại trên hệ thống.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setProductToRestore(null)}
                      disabled={isRestoring}
                      className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleRestoreProduct}
                      disabled={isRestoring}
                      className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRestoring ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        "Xác nhận khôi phục"
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default TrashProducts;
