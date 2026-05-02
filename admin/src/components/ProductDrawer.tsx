import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Info, Tag, DollarSign, Layers, Check, Trash2, Image as ImageIcon, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../validators/product.validator";
import { categoryService } from "../services/category.service";
import { productService } from "../services/product.service";
import { toast } from "sonner";
import { cn } from "../utils/cn";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ICategory {
  _id: string;
  title: string;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      gender: "unisex",
      weight: 0,
      price: 0,
      discountPercentage: 0,
      productStyles: [{ colorName: "", colorHex: "#000000", images: [], isDefault: true }],
      variants: [{ sku: "", colorName: "", size: "", stock: 0, priceDifference: 0 }],
    },
  });

  const { fields: styleFields, append: appendStyle, remove: removeStyle } = useFieldArray({
    control,
    name: "productStyles",
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await categoryService.getCategories();
          setCategories(res.data);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        }
      };
      fetchCategories();
    } else {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting Product Data:", data);
      
      toast.success("Sản phẩm đã được tạo thành công");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi tạo sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[60]"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-[0_0_50px_rgba(0,0,0,0.08)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-20">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] block">
                  Add New Item
                </span>
                <h3 className="text-2xl font-light text-neutral-900 tracking-tight">
                  Sản phẩm mới
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neutral-200"
                >
                  {isSubmitting ? "Đang xử lý..." : "Xuất bản sản phẩm"}
                </button>
              </div>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form className="p-10 space-y-16 pb-20">
                
                {/* 1. Basic Information */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <Info className="w-4 h-4 text-neutral-900" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                      Thông tin cơ bản
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tên sản phẩm</label>
                      <input
                        {...register("title")}
                        className="w-full bg-neutral-50 border-b border-transparent px-0 py-3 text-lg font-light outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-200"
                        placeholder="VD: Premium Silk Collection Shirt"
                      />
                      {errors.title && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mô tả sản phẩm</label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full bg-neutral-50 border-none p-4 text-sm font-light outline-none focus:ring-1 focus:ring-neutral-900 transition-all placeholder:text-neutral-200 resize-none"
                        placeholder="Mô tả về chất liệu, form dáng và phong cách thiết kế..."
                      />
                      {errors.description && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Danh mục</label>
                        <select
                          {...register("categoryId")}
                          className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.title}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.categoryId.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giới tính</label>
                        <div className="flex bg-neutral-50 p-1 rounded-sm gap-1">
                          {["male", "female", "unisex"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setValue("gender", g as any)}
                              className={cn(
                                "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                                watch("gender") === g
                                  ? "bg-white text-neutral-900 shadow-sm"
                                  : "text-neutral-400 hover:text-neutral-600"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Thương hiệu</label>
                        <input
                          {...register("brand")}
                          className="w-full bg-neutral-50 border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                          placeholder="TenClothes"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. Pricing & Logistics */}
                <section className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <DollarSign className="w-4 h-4 text-neutral-900" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                      Định giá & Vận chuyển
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giá niêm yết ($)</label>
                      <input
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                        placeholder="0.00"
                      />
                      {errors.price && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giảm giá (%)</label>
                      <input
                        type="number"
                        {...register("discountPercentage", { valueAsNumber: true })}
                        className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Trọng lượng (g)</label>
                      <input
                        type="number"
                        {...register("weight", { valueAsNumber: true })}
                        className="w-full bg-neutral-50 border-none px-4 py-3 text-sm font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                        placeholder="500"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Product Styles */}
                <section className="space-y-8">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-4 h-4 text-neutral-900" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                        Kiểu dáng & Hình ảnh
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendStyle({ colorName: "", colorHex: "#000000", images: [], isDefault: false })}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 hover:opacity-70 transition-opacity"
                    >
                      <Plus className="w-3 h-3" /> Thêm màu
                    </button>
                  </div>

                  <div className="space-y-10">
                    {styleFields.map((field, index) => (
                      <div key={field.id} className="p-6 bg-neutral-50/50 border border-neutral-100 relative group animate-in fade-in zoom-in-95 duration-500">
                        {styleFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStyle(index)}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-neutral-100 shadow-sm flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className="grid grid-cols-2 gap-8 mb-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Tên màu sắc</label>
                            <input
                              {...register(`productStyles.${index}.colorName` as const)}
                              placeholder="VD: Midnight Black"
                              className="w-full bg-white border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mã màu (Hex)</label>
                            <div className="flex gap-4">
                              <input
                                {...register(`productStyles.${index}.colorHex` as const)}
                                type="color"
                                className="h-11 w-20 p-1 bg-white border-none cursor-pointer outline-none"
                              />
                              <input
                                {...register(`productStyles.${index}.colorHex` as const)}
                                className="flex-1 bg-white border-none px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900 transition-all uppercase"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Hình ảnh (Sắp xếp theo thứ tự hiển thị)</label>
                          <div className="grid grid-cols-5 gap-4">
                            <div className="aspect-[3/4] bg-white border border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-900 hover:bg-neutral-50 transition-all group/upload">
                              <Upload className="w-5 h-5 text-neutral-300 group-hover/upload:text-neutral-900 transition-colors" />
                              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-2">Upload</span>
                            </div>
                            {[1, 2].map((i) => (
                              <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-sm relative group/img overflow-hidden">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button type="button" className="p-1.5 bg-white text-neutral-900 rounded-full hover:scale-110 transition-transform"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              styleFields.forEach((_, i) => setValue(`productStyles.${i}.isDefault`, false));
                              setValue(`productStyles.${index}.isDefault`, true);
                            }}
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                              watch(`productStyles.${index}.isDefault`) 
                                ? "bg-neutral-900 border-neutral-900" 
                                : "border-neutral-300 hover:border-neutral-900"
                            )}
                          >
                            {watch(`productStyles.${index}.isDefault`) && <Check className="w-2.5 h-2.5 text-white" />}
                          </button>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Đặt làm màu mặc định</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Variants */}
                <section className="space-y-8">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <Box className="w-4 h-4 text-neutral-900" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                        Phân loại & SKU
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendVariant({ sku: "", colorName: "", size: "", stock: 0, priceDifference: 0 })}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 hover:opacity-70 transition-opacity"
                    >
                      <Plus className="w-3 h-3" /> Thêm phân loại
                    </button>
                  </div>

                  <div className="bg-neutral-50 p-2 overflow-hidden border border-neutral-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-neutral-50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Màu sắc</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Size</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">SKU</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Kho</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Chênh lệch ($)</th>
                          <th className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantFields.map((field, index) => (
                          <tr key={field.id} className="border-b border-neutral-50 last:border-none group/tr">
                            <td className="p-2">
                              <select 
                                {...register(`variants.${index}.colorName` as const)}
                                className="w-full bg-white border-none px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                              >
                                <option value="">Chọn màu</option>
                                {watch("productStyles").map((s) => (
                                  <option key={s.colorName} value={s.colorName}>{s.colorName}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <input 
                                {...register(`variants.${index}.size` as const)}
                                placeholder="S, M, L..." 
                                className="w-full bg-white border-none px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                {...register(`variants.${index}.sku` as const)}
                                placeholder="SKU-XXXX" 
                                className="w-full bg-white border-none px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all uppercase"
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="number"
                                {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                                className="w-full bg-white border-none px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number"
                                {...register(`variants.${index}.priceDifference` as const, { valueAsNumber: true })}
                                className="w-full bg-white border-none px-3 py-2 text-[11px] font-medium outline-none focus:ring-1 focus:ring-neutral-900 transition-all"
                              />
                            </td>
                            <td className="p-2 text-center">
                              {variantFields.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => removeVariant(index)}
                                  className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover/tr:opacity-100"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 5. Visibility & Promotion */}
                <section className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-neutral-50 flex justify-between items-center group cursor-pointer" onClick={() => setValue("isActive", !watch("isActive"))}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Trạng thái hiển thị</span>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest">Hiển thị sản phẩm lên gian hàng</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      watch("isActive") ? "bg-neutral-900" : "bg-neutral-200"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        watch("isActive") ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-50 flex justify-between items-center group cursor-pointer" onClick={() => setValue("isFeatured", !watch("isFeatured"))}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Sản phẩm nổi bật</span>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest">Ưu tiên hiển thị tại trang chủ</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      watch("isFeatured") ? "bg-neutral-900" : "bg-neutral-200"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        watch("isFeatured") ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>
                </section>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;
