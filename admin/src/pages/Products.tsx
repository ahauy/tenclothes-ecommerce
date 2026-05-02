import React, { useState, useEffect, useRef } from "react";
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
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import type { IProductAdmin } from "../interfaces/product.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import ProductDrawer from "../components/ProductDrawer";
import type { IJsonFail } from "../interfaces/api.interface";

interface DropdownProps {
  options: { label: string; value: any; icon?: React.ReactNode }[];
  value: any;
  onChange: (value: any) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative flex-1 sm:flex-none" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 bg-white border border-neutral-100 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 w-full justify-between group hover:border-neutral-900",
          isOpen && "border-neutral-900 shadow-sm"
        )}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors">{icon}</span>}
          <span className={cn(selectedOption?.value !== "all" && value !== "desc" ? "text-neutral-900" : "text-neutral-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-neutral-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-neutral-100 shadow-[0_15px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden min-w-[180px]"
          >
            <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-5 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span className="text-neutral-400 group-hover:text-neutral-900">{option.icon}</span>}
                    <span className={cn(value === option.value ? "text-neutral-900" : "text-neutral-500")}>
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && <Check className="w-3 h-3 text-neutral-900" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters State
  const [dateSort, setDateSort] = useState<string>("desc");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        page,
        limit: 8,
        keyword: searchTerm,
        isActive: activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined,
        isFeatured: featuredFilter === "featured" ? true : featuredFilter === "normal" ? false : undefined,
        categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
        sort: dateSort === "desc" ? "-createdAt" : "createdAt",
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      // Optimistic UI update
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p)));

      await productService.changeStatus(id, newStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      // Revert on error
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: currentStatus } : p)));
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, dateSort, activeFilter, featuredFilter, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setDateSort("desc");
    setActiveFilter("all");
    setFeaturedFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  const activeFilterOptions = [
    { label: "Trạng thái", value: "all", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Đang hoạt động", value: "active", icon: <Check className="w-3.5 h-3.5" /> },
    { label: "Đang ẩn", value: "inactive", icon: <X className="w-3.5 h-3.5" /> },
  ];

  const featuredFilterOptions = [
    { label: "Loại hàng", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "Nổi bật", value: "featured", icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Sản phẩm thường", value: "normal", icon: <Package className="w-3.5 h-3.5" /> },
  ];

  const dateSortOptions = [
    { label: "Mới nhất", value: "desc", icon: <Calendar className="w-3.5 h-3.5" /> },
    { label: "Cũ nhất", value: "asc", icon: <Calendar className="w-3.5 h-3.5 opacity-50" /> },
  ];

  const categoryOptions = [
    { label: "Tất cả danh mục", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    ...categories.map((cat) => ({
      label: cat.title,
      value: cat._id,
    })),
  ];

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-1 block">
            CATALOG MANAGEMENT
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
            Sản phẩm
          </h2>
          <p className="text-neutral-500 font-light text-xs mt-1 hidden md:block">
            Quản lý kho hàng và thông tin chi tiết bộ sưu tập.
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Fluid Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row gap-4 w-full">
        {/* Search */}
        <div className="flex-1 min-w-[280px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            placeholder="TÌM KIẾM THEO TÊN, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-100 pl-12 pr-4 py-3 text-[11px] font-medium tracking-wider outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300 shadow-sm shadow-neutral-50"
          />
        </div>

        {/* Dropdown Filters Group - Responsive Wrap */}
        <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full xl:w-auto">
          <CustomDropdown
            placeholder="Ngày tạo"
            options={dateSortOptions}
            value={dateSort}
            onChange={setDateSort}
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <CustomDropdown
            placeholder="Trạng thái"
            options={activeFilterOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            icon={<Activity className="w-3.5 h-3.5" />}
          />
          <CustomDropdown
            placeholder="Loại hàng"
            options={featuredFilterOptions}
            value={featuredFilter}
            onChange={setFeaturedFilter}
            icon={<Zap className="w-3.5 h-3.5" />}
          />
          <CustomDropdown
            placeholder="Danh mục"
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            icon={<Layers className="w-3.5 h-3.5" />}
          />
          
          {/* Reset Filters Icon Button */}
          {(searchTerm || dateSort !== "desc" || activeFilter !== "all" || featuredFilter !== "all" || categoryFilter !== "all") && (
            <button
              onClick={resetFilters}
              title="Xóa tất cả lọc"
              className="px-4 py-3 bg-neutral-50 border border-neutral-100 text-neutral-400 hover:text-red-500 hover:border-red-100 transition-all ml-auto lg:ml-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Presentation - Table for Desktop, Cards for Mobile */}
      <div className="w-full min-h-[400px]">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {isLoading && products.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-5 border border-neutral-100 animate-pulse h-48" />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
                key={product._id}
                className="bg-white p-5 border border-neutral-100 shadow-sm relative group"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-28 bg-neutral-100 border border-neutral-100 flex-shrink-0 overflow-hidden">
                    {product.productStyles?.[0]?.images?.[0] ? (
                      <img src={product.productStyles[0].images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300"><Package className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-900 truncate mb-1">{product.title}</h4>
                    <p className="text-[8px] font-bold text-neutral-400 tracking-widest mb-2 uppercase">SKU: {product.variants?.[0]?.sku || "N/A"}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-neutral-900">${product.price.toLocaleString()}</span>
                      {product.discountPercentage > 0 && <span className="text-[8px] text-red-500 font-bold">-{product.discountPercentage}%</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[7px] font-black uppercase tracking-tighter bg-neutral-50 border border-neutral-100 px-1.5 py-0.5">{product.categoryId?.title || "UNSET"}</span>
                      {product.isFeatured && <span className="text-[7px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5">Featured</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                  <div className="flex items-center gap-2">
                     <div className={cn("w-2 h-2 rounded-full", product.isActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-neutral-300")} />
                     <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{product.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border border-neutral-50 hover:bg-neutral-900 hover:text-white transition-all"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-2 border border-neutral-50 hover:bg-neutral-900 hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button className="p-2 border border-neutral-50 hover:bg-red-500 hover:text-white transition-all text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : !isLoading && (
            <div className="col-span-full py-20 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Không tìm thấy sản phẩm nào</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block bg-white border border-neutral-100 overflow-hidden shadow-sm shadow-neutral-100">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="w-[35%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Sản Phẩm</th>
                <th className="w-[15%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Phân Loại</th>
                <th className="w-[15%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Giá Niêm Yết</th>
                <th className="w-[10%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Tồn Kho</th>
                <th className="w-[12%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Trạng Thái</th>
                <th className="w-[13%] px-8 py-6 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 min-h-[480px]">
              {isLoading && products.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-[100px]">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-22 bg-neutral-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-neutral-100 w-2/3" />
                          <div className="h-2 bg-neutral-100 w-1/3" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0.4 : 1 }}
                    exit={{ opacity: 0 }}
                    key={product._id}
                    className="group hover:bg-neutral-50/30 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-22 bg-neutral-100 overflow-hidden relative border border-neutral-200">
                          {product.productStyles?.[0]?.images?.[0] ? (
                            <img src={product.productStyles[0].images[0]} alt={product.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50"><Package className="w-7 h-7 stroke-1" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-bold text-neutral-900 uppercase tracking-widest group-hover:text-black transition-colors truncate">{product.title}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-widest border border-neutral-100 px-1.5 py-0.5 rounded-[1px]">SKU: {product.variants?.[0]?.sku || "N/A"}</span>
                            {product.isFeatured && <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded-[1px]">Featured</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-neutral-700 uppercase tracking-tight truncate">{product.categoryId?.title || "Chưa phân loại"}</span>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest">{product.gender}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-neutral-900 tabular-nums">${product.price.toLocaleString()}</span>
                        {product.discountPercentage > 0 && <span className="text-[9px] text-red-400 font-bold uppercase tracking-tighter">-{product.discountPercentage}% OFF</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={cn("text-[11px] font-bold tabular-nums", product.totalStock <= 5 ? "text-red-500" : "text-neutral-900")}>{product.totalStock}</span>
                        <div className={cn("w-8 h-0.5 mt-1 rounded-full", product.totalStock <= 5 ? "bg-red-100" : "bg-neutral-100")} />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <div 
                          onClick={() => handleToggleStatus(product._id, product.isActive)}
                          className={cn(
                            "w-10 h-5.5 p-0.5 rounded-full transition-all duration-500 cursor-pointer border relative overflow-hidden group/toggle", 
                            product.isActive 
                              ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                              : "bg-neutral-100 border-neutral-200"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm relative z-10", 
                            product.isActive ? "translate-x-4" : "translate-x-0"
                          )} />
                          {product.isActive && (
                            <div className="absolute inset-0 bg-emerald-400 animate-pulse opacity-20" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button title="Xem chi tiết" className="p-2.5 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-50 rounded-[2px]"><Eye className="w-4 h-4 stroke-[1.25]" /></button>
                        <button title="Chỉnh sửa" className="p-2.5 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-50 rounded-[2px]"><Edit2 className="w-4 h-4 stroke-[1.25]" /></button>
                        <button title="Xóa" className="p-2.5 hover:bg-red-600 hover:text-white transition-all border border-neutral-50 rounded-[2px]"><Trash2 className="w-4 h-4 stroke-[1.25]" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : !isLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Không tìm thấy sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Full Width Responsive */}
      <div className="px-8 py-8 bg-white border border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-6 w-full shadow-sm shadow-neutral-50">
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest order-2 sm:order-1">
          Trang {page} / {totalPages}
        </p>
        <div className="flex gap-4 order-1 sm:order-2 w-full sm:w-auto">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ProductDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => {
          setIsDrawerOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
};

export default Products;
