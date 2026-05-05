import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  RefreshCcw,
  Package,
  Calendar,
  Check,
  Zap,
  Layers,
  Activity,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { IProductAdmin } from "../../interfaces/product.interface";
import { toast } from "sonner";
import type { IJsonFail } from "../../interfaces/api.interface";
import ReactPaginateLib from "react-paginate";
import CustomDropdown from "../UI/CustomDropdown";

const ReactPaginate: any = (ReactPaginateLib as any).default || ReactPaginateLib;

interface TrashDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore?: () => void;
}

const TrashDrawer: React.FC<TrashDrawerProps> = ({ isOpen, onClose, onRestore }) => {
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProductAdmin | null>(null);
  const [productToRestore, setProductToRestore] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchProducts = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        page,
        limit: 8,
        keyword: searchTerm,
        isActive: activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined,
        isFeatured: featuredFilter === "featured" ? true : featuredFilter === "normal" ? false : undefined,
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
  }, [isOpen, page, searchTerm, activeFilter, featuredFilter, categoryFilter, startDate, endDate]);

  const handleRestoreProduct = async () => {
    if (!productToRestore) return;
    setIsRestoring(true);
    try {
      await productService.restoreProduct(productToRestore.slug);
      toast.success(`Đã khôi phục sản phẩm "${productToRestore.title}"`);
      setProductToRestore(null);
      fetchProducts();
      if (onRestore) onRestore();
    } catch (error) {
      toast.error("Không thể khôi phục sản phẩm. Vui lòng thử lại!");
    } finally {
      setIsRestoring(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories().then((res) => {
        const flatten = (cats: any[]): any[] => {
          let res: any[] = [];
          cats.forEach((cat) => {
            res.push({ _id: cat._id, title: `${cat.level > 1 ? "└ ".repeat(cat.level - 1) : ""}${cat.title}` });
            if (cat.children) res = [...res, ...flatten(cat.children)];
          });
          return res;
        };
        setCategories(flatten(res.data || []));
      });
    }
  }, [isOpen]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

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
    { label: "Tất cả trạng thái", value: "all", icon: <Activity className="w-3.5 h-3.5" /> },
    { label: "Đang hoạt động", value: "active", icon: <Check className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Đang ẩn", value: "inactive", icon: <X className="w-3.5 h-3.5 text-neutral-400" /> },
  ];

  const featuredFilterOptions = [
    { label: "Tất cả loại hàng", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "Sản phẩm nổi bật", value: "featured", icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
    { label: "Sản phẩm thường", value: "normal", icon: <Package className="w-3.5 h-3.5" /> },
  ];

  const categoryOptions = [
    { label: "Tất cả danh mục", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
    ...categories.map((cat) => ({ label: cat.title, value: cat._id })),
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 h-full w-full max-w-5xl bg-white shadow-[0_0_50px_rgba(0,0,0,0.08)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] block">
                  QUẢN LÝ LƯU TRỮ
                </span>
                <h3 className="text-2xl font-light text-neutral-900 tracking-tight">Thùng rác hệ thống</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
              {/* Toolbar */}
              <div className="bg-neutral-50/50 border border-neutral-100 rounded-sm p-6 space-y-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm đã xóa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-sm pl-12 pr-4 py-3 text-xs font-light outline-none focus:border-neutral-900 transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[280px] flex items-center justify-between gap-3 px-4 py-2 bg-white border border-neutral-200 rounded-sm">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[11px] font-medium outline-none cursor-pointer" />
                    <span className="text-neutral-300">-</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[11px] font-medium outline-none cursor-pointer" />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <CustomDropdown 
                      options={activeFilterOptions} 
                      value={activeFilter} 
                      onChange={(val) => setActiveFilter(String(val))} 
                      placeholder="Trạng thái" 
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <CustomDropdown 
                      options={featuredFilterOptions} 
                      value={featuredFilter} 
                      onChange={(val) => setFeaturedFilter(String(val))} 
                      placeholder="Loại hàng" 
                    />
                  </div>
                  
                  {(searchTerm || startDate || endDate || activeFilter !== "all" || featuredFilter !== "all" || categoryFilter !== "all") && (
                    <button onClick={resetFilters} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>

              {/* Table Section */}
              <div className="border border-neutral-100 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-100">
                      <th className="w-[35%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sản Phẩm</th>
                      <th className="w-[20%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Giá</th>
                      <th className="w-[15%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Tồn Kho</th>
                      <th className="w-[30%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse"><td colSpan={4} className="h-20 bg-neutral-50/30"></td></tr>
                      ))
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id} className="group hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-neutral-100 rounded-sm overflow-hidden border border-neutral-100 flex-shrink-0">
                                {product.productStyles?.[0]?.images?.[0] ? (
                                  <img src={product.productStyles[0].images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-neutral-300" /></div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[11px] font-bold text-neutral-900 uppercase truncate mb-1">{product.title}</h4>
                                <span className="text-[9px] text-neutral-400 font-medium">SKU: {product.variants?.[0]?.sku || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[12px] font-medium text-neutral-900">${product.price.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-center text-[12px] font-medium">{product.totalStock}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setProductToRestore({ id: product._id, title: product.title, slug: product.slug })}
                              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all rounded-sm flex items-center gap-2 ml-auto"
                            >
                              <RefreshCcw className="w-3 h-3" /> Khôi phục
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="py-20 text-center text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Không có dữ liệu</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center py-6 border-t border-neutral-100">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase">Page {page} of {totalPages}</span>
                   <ReactPaginate
                    breakLabel="..."
                    nextLabel={<X className="w-3 h-3 rotate-[-90deg]" />}
                    onPageChange={(e: any) => setPage(e.selected + 1)}
                    pageCount={totalPages}
                    forcePage={page - 1}
                    previousLabel={<X className="w-3 h-3 rotate-90" />}
                    containerClassName="flex items-center gap-2"
                    pageClassName="w-8 h-8 flex items-center justify-center text-[10px] font-bold border border-neutral-100 hover:border-neutral-900 transition-all rounded-sm"
                    activeClassName="!border-neutral-900 bg-neutral-900 text-white"
                    previousClassName="w-8 h-8 flex items-center justify-center border border-neutral-100 rounded-sm"
                    nextClassName="w-8 h-8 flex items-center justify-center border border-neutral-100 rounded-sm"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Confirm Restore Modal */}
          {createPortal(
            <AnimatePresence>
              {productToRestore && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100]" />
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 max-w-sm w-full rounded-sm shadow-2xl space-y-6 text-center">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <RefreshCcw className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-light">Khôi phục sản phẩm?</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Sản phẩm <span className="font-bold text-neutral-900">"{productToRestore.title}"</span> sẽ được đưa trở lại kho hàng.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setProductToRestore(null)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-all">Hủy</button>
                        <button onClick={handleRestoreProduct} disabled={isRestoring} className="flex-1 py-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50">
                          {isRestoring ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Xác nhận"}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>,
            document.body
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TrashDrawer;