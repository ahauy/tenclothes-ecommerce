import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Check,
  Zap,
  Layers,
  Activity,
  X,
  History,
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import type { IProductAdmin } from "../interfaces/product.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import type { IJsonFail } from "../interfaces/api.interface";
import ProductDrawer from "../components/products/ProductDrawer";
// import ReactPaginate from 'react-paginate';
import ReactPaginateLib from "react-paginate";
const ReactPaginate: any =
  (ReactPaginateLib as any).default || ReactPaginateLib;
import CustomDropdown from "../components/UI/CustomDropdown";
import TrashDrawer from "../components/trash/TrashDrawer";
import ProductHistoryDrawer from "../components/products/ProductHistoryDrawer";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [categories, setCategories] = useState<
    { _id: string; title: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: cập nhật debouncedSearchTerm sau 500ms khi user ngừng gõ
  useEffect(() => {
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchTerm]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProductAdmin | null>(
    null,
  );
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    title: string;
    slug: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<{
    slug: string;
    title: string;
  } | null>(null);

  // Dùng useCallback để bọc lại, tránh render vô hạn khi đưa vào dependencies của useEffect
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        page,
        limit: 8,
        keyword: debouncedSearchTerm,
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
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
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
    debouncedSearchTerm,
    activeFilter,
    featuredFilter,
    categoryFilter,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  ]);

  const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      setProducts((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, isActive: newStatus } : p)),
      );

      await productService.changeStatus(slug, newStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error: unknown) {
      const err = error as IJsonFail;
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isActive: currentStatus } : p,
        ),
      );
      toast.error(err?.message || "Không thể cập nhật trạng thái");
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
    } catch (error: unknown) {
      const err = error as IJsonFail;
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isFeatured: currentFeatured } : p,
        ),
      );
      toast.error(err?.message || "Không thể cập nhật sản phẩm nổi bật");
    }
  };

  const handleSelectAll = () => {
    if (products.length > 0 && selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.slug));
    }
  };

  const handleSelectProduct = (slug: string) => {
    if (selectedProducts.includes(slug)) {
      setSelectedProducts(selectedProducts.filter((s) => s !== slug));
    } else {
      setSelectedProducts([...selectedProducts, slug]);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`)) return;

    setIsBatchProcessing(true);
    try {
      await productService.batchDelete(selectedProducts);
      toast.success(`Đã xóa ${selectedProducts.length} sản phẩm thành công`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error: unknown) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể xóa các sản phẩm đã chọn");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchChangeStatus = async (status: boolean) => {
    if (selectedProducts.length === 0) return;
    setIsBatchProcessing(true);
    try {
      await productService.batchChangeStatus(selectedProducts, status);
      toast.success(`Đã ${status ? "hiển thị" : "ẩn"} ${selectedProducts.length} sản phẩm`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error: unknown) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể cập nhật trạng thái");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchChangeFeatured = async (isFeatured: boolean) => {
    if (selectedProducts.length === 0) return;
    setIsBatchProcessing(true);
    try {
      await productService.batchChangeFeatured(selectedProducts, isFeatured);
      toast.success(`Đã ${isFeatured ? "đặt nổi bật" : "bỏ nổi bật"} ${selectedProducts.length} sản phẩm`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error: unknown) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể cập nhật nổi bật");
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.slug);
      toast.success(`Đã xóa sản phẩm "${productToDelete.title}"`);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: unknown) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể xóa sản phẩm. Vui lòng thử lại!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Sử dụng hàm async bên trong useEffect để tránh cảnh báo set-state-in-effect
  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
    };
    loadData();
  }, [fetchProducts]);

  // Di chuyển logic fetchCategories vào bên trong useEffect vì nó chỉ chạy 1 lần
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
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setActiveFilter("all");
    setFeaturedFilter("all");
    setCategoryFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    setSelectedProducts([]);
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
              QUẢN LÝ DANH MỤC
            </span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
              Kho Hàng
            </h2>
            <p className="text-neutral-500 font-medium text-sm hidden md:block">
              Theo dõi, cập nhật và quản lý toàn bộ sản phẩm trong hệ thống.
            </p>
          </div>

          {/* Nhóm các nút thao tác */}
          <div className="flex w-full sm:w-auto items-center gap-3">
            {/* Nút Thùng Rác */}
            <button
              onClick={() => setIsTrashOpen(true)}
              title="Xem sản phẩm đã xóa"
              className="flex flex-1 sm:flex-none items-center justify-center gap-2.5 px-4 py-3 bg-white border border-neutral-200 text-neutral-600 text-[11px] font-bold uppercase tracking-wider rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm transition-all duration-300 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Thùng Rác</span>
            </button>

            {/* Nút Thêm Mới */}
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsDrawerOpen(true);
              }}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2.5 px-6 py-3 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-md hover:bg-neutral-800 shadow-md shadow-neutral-900/10 transition-all duration-300 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Sản Phẩm Mới</span>
            </button>
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

            {/* Price Range Filter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50/50 border border-neutral-200 rounded-md hover:border-neutral-400 hover:bg-white transition-colors flex-1 min-w-[240px] xl:flex-none">
              <span className="text-neutral-400 font-bold text-[11px] flex-shrink-0">đ</span>
              <div className="flex items-center w-full group">
                <input
                  type="number"
                  min="0"
                  placeholder="Giá từ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  title="Giá từ"
                />
                <span className="text-neutral-300 text-xs px-2">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Đến giá"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-transparent text-[11px] font-medium outline-none w-full text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  title="Đến giá"
                />
              </div>
            </div>

            <CustomDropdown
              placeholder="Trạng thái"
              options={activeFilterOptions}
              value={activeFilter}
              onChange={(val) => setActiveFilter(val)}
              icon={<Activity className="w-4 h-4" />}
            />
            <CustomDropdown
              placeholder="Phân loại"
              options={featuredFilterOptions}
              value={featuredFilter}
              onChange={(val) => setFeaturedFilter(val)}
              icon={<Zap className="w-4 h-4" />}
            />
            <CustomDropdown
              placeholder="Danh mục"
              options={categoryOptions}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              icon={<Layers className="w-4 h-4" />}
            />

            {/* Reset Filters Icon Button */}
            {(searchTerm ||
              startDate ||
              endDate ||
              minPrice ||
              maxPrice ||
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

        {/* Batch Actions Toolbar */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-neutral-900 rounded-xl shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden mb-4"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px]">
                  {selectedProducts.length}
                </div>
                <span className="text-white text-[13px] font-medium whitespace-nowrap">
                  sản phẩm đang chọn
                </span>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="ml-2 text-neutral-400 hover:text-white transition-colors text-[11px] underline underline-offset-2"
                >
                  Bỏ chọn
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleBatchChangeStatus(true)}
                  disabled={isBatchProcessing}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Hiện
                </button>
                <button
                  onClick={() => handleBatchChangeStatus(false)}
                  disabled={isBatchProcessing}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <X className="w-3.5 h-3.5 text-neutral-400" /> Ẩn
                </button>
                <div className="w-px h-6 bg-white/20 hidden sm:block mx-1"></div>
                <button
                  onClick={() => handleBatchChangeFeatured(true)}
                  disabled={isBatchProcessing}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Đặt Nổi Bật
                </button>
                <button
                  onClick={() => handleBatchChangeFeatured(false)}
                  disabled={isBatchProcessing}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5 text-neutral-400" /> Bỏ Nổi Bật
                </button>
                <div className="w-px h-6 bg-white/20 hidden sm:block mx-1"></div>
                <button
                  onClick={handleBatchDelete}
                  disabled={isBatchProcessing}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Presentation - Table for Desktop, Cards for Mobile */}
        <div className="w-full min-h-[400px]">
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {isLoading && products.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 border border-neutral-100 rounded-xl animate-pulse flex flex-col min-h-[200px]"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-start pt-1">
                      <div className="w-5 h-5 bg-neutral-100 rounded-[3px]" />
                    </div>
                    <div className="w-20 h-24 bg-neutral-100 rounded-md flex-shrink-0" />
                    <div className="flex-1 py-1 space-y-3">
                      <div className="h-3.5 bg-neutral-100 w-3/4 rounded-sm" />
                      <div className="h-2 bg-neutral-100 w-1/2 rounded-sm" />
                      <div className="h-3.5 bg-neutral-100 w-1/3 rounded-sm mt-1" />
                      <div className="flex gap-1.5 mt-2">
                        <div className="h-4 bg-neutral-100 w-16 rounded-[3px]" />
                        <div className="h-4 bg-neutral-100 w-12 rounded-[3px]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-3 border-t border-neutral-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4.5 bg-neutral-100 rounded-full" />
                          <div className="h-2 bg-neutral-100 w-12 rounded-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-4.5 bg-neutral-100 rounded-full" />
                          <div className="h-2 bg-neutral-100 w-12 rounded-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <div className="flex-1 h-8 bg-neutral-100 rounded-md" />
                      <div className="flex-1 h-8 bg-neutral-100 rounded-md" />
                      <div className="flex-1 h-8 bg-neutral-100 rounded-md" />
                    </div>
                  </div>
                </div>
              ))
              : products.length > 0
                ? products.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: isLoading ? 0.6 : 1, y: 0 }}
                    key={product._id}
                    className={cn(
                      "p-4 border rounded-xl shadow-sm transition-all relative flex flex-col",
                      selectedProducts.includes(product.slug)
                        ? "bg-neutral-50/80 border-neutral-400 ring-1 ring-neutral-900/5"
                        : "bg-white border-neutral-200 hover:shadow-md group"
                    )}
                  >
                    <div className="flex gap-4 mb-4">
                      {/* Checkbox */}
                      <div
                        className="flex items-start pt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product.slug);
                        }}
                      >
                        <button className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none">
                          {selectedProducts.includes(product.slug) ? (
                            <CheckSquare className="w-5 h-5 text-neutral-900" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </div>
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
                            đ{product.price.toLocaleString()}
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
                          title="Lịch sử"
                          onClick={() => {
                            setSelectedProductForHistory({
                              slug: product.slug,
                              title: product.title,
                            });
                            setIsHistoryOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all text-neutral-600"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        {/* <button
                            className="flex-1 flex items-center justify-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all text-neutral-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button> */}
                        <button
                          onClick={() => {
                            setProductToEdit(product);
                            setIsDrawerOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center p-2 border border-neutral-200 rounded-md hover:bg-neutral-900 hover:border-neutral-900 hover:text-white transition-all text-neutral-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setProductToDelete({
                              id: product._id,
                              title: product.title,
                              slug: product.slug,
                            });
                          }}
                          className="flex-1 flex items-center justify-center p-2 border border-neutral-200 rounded-md hover:bg-red-500 hover:border-red-500 hover:text-white transition-all text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
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
                  <th className="w-[5%] px-6 py-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
                    >
                      {products.length > 0 && selectedProducts.length === products.length ? (
                        <CheckSquare className="w-5 h-5 text-neutral-900" />
                      ) : selectedProducts.length > 0 ? (
                        <MinusSquare className="w-5 h-5 text-neutral-900" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="w-[25%] px-2 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
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
                      <td className="px-6 py-4">
                        <div className="w-5 h-5 bg-neutral-100 rounded-[3px] mx-auto" />
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-16 bg-neutral-100 rounded-md flex-shrink-0" />
                          <div className="flex-1 space-y-2 pr-2">
                            <div className="h-3 bg-neutral-100 w-3/4 rounded-sm" />
                            <div className="h-2 bg-neutral-100 w-1/2 rounded-sm" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-3 bg-neutral-100 w-24 rounded-sm" />
                          <div className="h-2 bg-neutral-100 w-16 rounded-sm" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-3 bg-neutral-100 w-16 rounded-sm" />
                          <div className="h-2 bg-neutral-100 w-12 rounded-sm" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="h-3 bg-neutral-100 w-8 rounded-sm mb-1.5" />
                          <div className="w-6 h-1 bg-neutral-100 rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-10 h-5.5 bg-neutral-100 rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-10 h-5.5 bg-neutral-100 rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="w-8 h-8 bg-neutral-100 rounded-md" />
                          <div className="w-8 h-8 bg-neutral-100 rounded-md" />
                          <div className="w-8 h-8 bg-neutral-100 rounded-md" />
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
                        className={cn(
                          "transition-colors duration-200",
                          selectedProducts.includes(product.slug)
                            ? "bg-neutral-50/80"
                            : "group hover:bg-neutral-50/50"
                        )}
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduct(product.slug);
                            }}
                            className="flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
                          >
                            {selectedProducts.includes(product.slug) ? (
                              <CheckSquare className="w-5 h-5 text-neutral-900" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-4">
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
                              {product.price.toLocaleString()} đ
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
                              title="Lịch sử"
                              onClick={() => {
                                setSelectedProductForHistory({
                                  slug: product.slug,
                                  title: product.title,
                                });
                                setIsHistoryOpen(true);
                              }}
                              className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors rounded-md"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            {/* <button
                                  title="Xem chi tiết"
                                  className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors rounded-md"
                                >
                                  <Eye className="w-4 h-4" />
                                </button> */}
                            <button
                              title="Chỉnh sửa"
                              onClick={() => {
                                setProductToEdit(product);
                                setIsDrawerOpen(true);
                              }}
                              className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors rounded-md"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setProductToDelete({
                                  id: product._id,
                                  title: product.title,
                                  slug: product.slug,
                                });
                              }}
                              title="Xóa"
                              className="p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors rounded-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                    : !isLoading && (
                      <tr>
                        <td
                          colSpan={8}
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

        <TrashDrawer
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          onRestore={() => fetchProducts()}
        />

        <ProductHistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          productSlug={selectedProductForHistory?.slug || null}
          productTitle={selectedProductForHistory?.title || null}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {productToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isDeleting && setProductToDelete(null)}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[9999]"
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
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Xóa sản phẩm
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Bạn có chắc chắn muốn xóa sản phẩm <br />
                        <span className="font-bold text-neutral-900">
                          "{productToDelete.title}"
                        </span>
                        ? <br />
                        Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setProductToDelete(null)}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleDeleteProduct}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 text-[12px] font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 shadow-md shadow-red-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        "Xác nhận xóa"
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

export default Products;