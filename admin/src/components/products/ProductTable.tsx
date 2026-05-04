import React, { useState } from "react";
import { Eye, Edit2, Trash2, Package, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import type { IProductAdmin } from "../../interfaces/product.interface";
import ReactPaginateLib from "react-paginate";

const ReactPaginate: any = (ReactPaginateLib as any).default || ReactPaginateLib;

interface ProductTableProps {
  products: IProductAdmin[];
  isLoading: boolean;
  mode: "active" | "trash";
  page: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  onToggleStatus?: (slug: string, current: boolean) => void;
  onToggleFeatured?: (slug: string, current: boolean) => void;
  onEdit?: (product: IProductAdmin) => void;
  onDelete?: (product: IProductAdmin) => void;
  onRestore?: (product: IProductAdmin) => void;
  onBulkAction?: (slugs: string[]) => void; // Xử lý xóa hoặc khôi phục nhiều
}

const ProductTable: React.FC<ProductTableProps> = ({
  products, isLoading, mode, page, totalPages, totalProducts, onPageChange,
  onToggleStatus, onToggleFeatured, onEdit, onDelete, onRestore, onBulkAction
}) => {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedSlugs(products.map(p => p.slug));
    else setSelectedSlugs([]);
  };

  const handleSelect = (slug: string) => {
    setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const executeBulkAction = () => {
    if (onBulkAction) onBulkAction(selectedSlugs);
    setSelectedSlugs([]);
  };

  return (
    <div className="w-full relative">
      {/* Floating Action Bar cho Thao tác hàng loạt */}
      <AnimatePresence>
        {selectedSlugs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-2xl border border-neutral-700"
          >
            <span className="text-sm font-semibold">Đã chọn {selectedSlugs.length} sản phẩm</span>
            <button
              onClick={executeBulkAction}
              className={cn("px-4 py-2 text-xs font-bold rounded-full transition-colors", mode === "active" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600")}
            >
              {mode === "active" ? "Xóa tất cả" : "Khôi phục tất cả"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Tối ưu cuộn ngang cho màn hình hẹp */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="w-[5%] px-6 py-4">
                  <input type="checkbox" checked={products.length > 0 && selectedSlugs.length === products.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer" />
                </th>
                <th className="w-[25%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sản Phẩm</th>
                <th className="w-[15%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Phân Loại</th>
                <th className="w-[15%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Giá</th>
                <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Tồn Kho</th>
                {mode === "active" && (
                  <>
                    <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Hiển Thị</th>
                    <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">Nổi Bật</th>
                  </>
                )}
                <th className="w-[10%] px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 min-h-[400px]">
              {isLoading && products.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={8} className="px-6 py-4 h-[90px] bg-neutral-50/50" /></tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={product._id} className={cn("group transition-colors duration-200", selectedSlugs.includes(product.slug) ? "bg-neutral-50" : "hover:bg-neutral-50/50")}>
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedSlugs.includes(product.slug)} onChange={() => handleSelect(product.slug)} className="w-4 h-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-50 rounded-md overflow-hidden border border-neutral-200 flex-shrink-0">
                          {product.productStyles?.[0]?.images?.[0] ? <img src={product.productStyles[0].images[0]} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-neutral-300 m-auto mt-3" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[12px] font-bold text-neutral-900 uppercase truncate mb-1" title={product.title}>{product.title}</h4>
                          <span className="text-[9px] text-neutral-500 font-semibold uppercase bg-neutral-100 px-1.5 py-0.5 rounded-[3px]">SKU: {product.variants?.[0]?.sku || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold text-neutral-700 block truncate">{product.categoryIds?.[0]?.title || "CHƯA PHÂN LOẠI"}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">${product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center font-bold">{product.totalStock}</td>
                    
                    {mode === "active" && (
                      <>
                        <td className="px-6 py-4 text-center">
                          {/* Toggle Logic */}
                          <div onClick={() => onToggleStatus && onToggleStatus(product.slug, product.isActive)} className={cn("w-10 h-5.5 p-0.5 rounded-full transition-colors cursor-pointer border mx-auto relative", product.isActive ? "bg-emerald-500 border-emerald-600" : "bg-neutral-200 border-neutral-300")}>
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-transform shadow-sm", product.isActive && "translate-x-[18px]")} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div onClick={() => onToggleFeatured && onToggleFeatured(product.slug, product.isFeatured)} className={cn("w-10 h-5.5 p-0.5 rounded-full transition-colors cursor-pointer border mx-auto relative", product.isFeatured ? "bg-amber-500 border-amber-600" : "bg-neutral-200 border-neutral-300")}>
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-transform shadow-sm", product.isFeatured && "translate-x-[18px]")} />
                          </div>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {mode === "active" ? (
                          <>
                            <button onClick={() => onEdit?.(product)} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => onDelete?.(product)} className="p-2 text-red-400 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <button onClick={() => onRestore?.(product)} className="px-3 py-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-md text-[10px] font-bold flex gap-2 items-center"><RefreshCcw className="w-3 h-3" /> KHÔI PHỤC</button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr><td colSpan={8} className="py-20 text-center text-neutral-400 text-xs">Không tìm thấy sản phẩm</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white px-6 py-4 border border-neutral-200 rounded-xl">
          <span className="text-[11px] text-neutral-500">Hiển thị {(page - 1) * 8 + 1} - {Math.min(page * 8, totalProducts)} / {totalProducts}</span>
          <ReactPaginate
            previousLabel={<ChevronLeft className="w-4 h-4" />} nextLabel={<ChevronRight className="w-4 h-4" />}
            pageCount={totalPages} forcePage={page - 1} onPageChange={(e: any) => onPageChange(e.selected + 1)}
            containerClassName="flex gap-1" pageClassName="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 cursor-pointer text-xs"
            activeClassName="bg-neutral-900 text-white hover:bg-neutral-800"
          />
        </div>
      )}
    </div>
  );
};
export default ProductTable;