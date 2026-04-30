import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "../services/product.service";
import type { IProductAdmin } from "../interfaces/product.interface";
import { cn } from "../utils/cn";
import { toast } from "sonner";
import ProductDrawer from "../components/ProductDrawer";
import type { IJsonFail } from "../interfaces/api.interface";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProductAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({
        page,
        limit: 8,
        keyword: searchTerm,
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      // Ép kiểu error về interface IJsonFail
      const err = error as IJsonFail;
      toast.error(err?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [page, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-2 block">
            CATALOG MANAGEMENT
          </span>
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Sản phẩm
          </h2>
          <p className="text-neutral-500 font-light text-sm mt-1">
            Quản lý kho hàng và thông tin chi tiết sản phẩm.
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            placeholder="TÌM THEO TÊN, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-100 pl-12 pr-4 py-3 text-[11px] font-medium tracking-wider outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-300"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-neutral-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Sản Phẩm
                </th>
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Phân Loại
                </th>
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-neutral-900 transition-colors">
                    Giá Gốc <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">
                  Tồn Kho
                </th>
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">
                  Trạng Thái
                </th>
                <th className="px-8 py-5 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={6}
                        className="px-8 py-6 h-20 bg-neutral-50/10"
                      />
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={product._id}
                      className="group hover:bg-neutral-50/30 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-20 bg-neutral-100 overflow-hidden relative border border-neutral-200">
                            {product.productStyles?.[0]?.images?.[0] ? (
                              <img
                                src={product.productStyles[0].images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest group-hover:text-black transition-colors">
                              {product.title}
                            </h4>
                            <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-tighter">
                              SKU: {product.variants?.[0]?.sku || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-neutral-700 uppercase tracking-tight">
                            {product.categoryId?.title || "Chưa phân loại"}
                          </span>
                          <span className="text-[9px] text-neutral-400 uppercase tracking-widest">
                            {product.gender}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-900">
                            ${product.price.toLocaleString()}
                          </span>
                          {product.discountPercentage > 0 && (
                            <span className="text-[9px] text-red-400 font-bold uppercase">
                              -{product.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "text-[11px] font-bold",
                              product.totalStock <= 5
                                ? "text-red-500"
                                : "text-neutral-900",
                            )}
                          >
                            {product.totalStock}
                          </span>
                          <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-tighter">
                            đơn vị
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <div
                            className={cn(
                              "w-10 h-5 p-0.5 rounded-full transition-all duration-500 cursor-pointer border",
                              product.isActive
                                ? "bg-neutral-900 border-neutral-900"
                                : "bg-neutral-100 border-neutral-200",
                            )}
                          >
                            <div
                              className={cn(
                                "w-3.5 h-3.5 bg-white transition-all duration-500",
                                product.isActive
                                  ? "translate-x-5"
                                  : "translate-x-0",
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="p-2 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-100">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-100">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 hover:bg-red-600 hover:text-white transition-all border border-neutral-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
                        Không tìm thấy sản phẩm nào
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-neutral-50 flex justify-between items-center">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            Trang {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border border-neutral-100 disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border border-neutral-100 disabled:opacity-30 hover:bg-neutral-900 hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
