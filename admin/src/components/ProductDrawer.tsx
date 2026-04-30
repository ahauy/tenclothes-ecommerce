import React from "react";
import { X, Upload, Plus, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, onClose }) => {
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] overflow-y-auto"
          >
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 tracking-tight">Thêm sản phẩm mới</h3>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">Cấu hình thông tin chi tiết</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-neutral-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="p-8 space-y-12">
              {/* Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Info className="w-4 h-4 text-neutral-900" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900">Thông tin cơ bản</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Tên sản phẩm</label>
                    <input 
                      type="text" 
                      placeholder="VD: Premium Silk Shirt"
                      className="w-full bg-neutral-50 border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Giá gốc ($)</label>
                      <input 
                        type="number" 
                        placeholder="299"
                        className="w-full bg-neutral-50 border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Giảm giá (%)</label>
                      <input 
                        type="number" 
                        placeholder="10"
                        className="w-full bg-neutral-50 border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Media Upload */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Upload className="w-4 h-4 text-neutral-900" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900">Hình ảnh sản phẩm</h4>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-[3/4] bg-neutral-50 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all group">
                    <Plus className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-2">Upload</span>
                  </div>
                </div>
              </section>

              <div className="pt-8 flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  className="flex-[2] py-4 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 shadow-xl transition-all"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
