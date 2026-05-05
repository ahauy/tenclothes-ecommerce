import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, History, Package } from "lucide-react";
import { productService } from "../../services/product.service";
import ProductHistoryTimeline from "./ProductHistoryTimeline";
import type { IProductHistoryEntry } from "../../interfaces/productHistory.interface";
import { toast } from "sonner";

interface ProductHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string | null;
  productTitle: string | null;
}

const ProductHistoryDrawer: React.FC<ProductHistoryDrawerProps> = ({
  isOpen,
  onClose,
  productSlug,
  productTitle,
}) => {
  const [history, setHistory] = useState<IProductHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productSlug) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const response = await productService.getProductHistory(productSlug);
          if (response.status) {
            setHistory(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch product history:", error);
          toast.error("Không thể tải lịch sử sản phẩm");
        } finally {
          setIsLoading(false);
        }
      };

      fetchHistory();
    } else {
      // Clear history when closed to avoid flash of old data
      if (!isOpen) {
        setHistory([]);
      }
    }
  }, [isOpen, productSlug]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-neutral-200"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white shadow-sm">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Lịch sử sản phẩm
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Package className="w-3 h-3 text-neutral-400" />
                    <span className="text-[11px] font-medium text-neutral-500 truncate max-w-[200px]">
                      {productTitle || "Đang tải..."}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-neutral-400 hover:text-neutral-900 border border-transparent hover:border-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <ProductHistoryTimeline entries={history} isLoading={isLoading} />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/30 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductHistoryDrawer;
