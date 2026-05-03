import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Image as ImageIcon, Box, ChevronDown, Check, Upload, Info, DollarSign, Wand2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../validators/product.validator";
import { categoryService } from "../services/category.service";
import { toast } from "sonner";
import { cn } from "../utils/cn";
import { uploadService } from "../services/upload.service";
import { productService } from "../services/product.service";
import type { IProductAdmin } from "../interfaces/product.interface";
import type { IJsonFail } from "../interfaces/api.interface";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: IProductAdmin | null;
}

interface ICategory {
  _id: string;
  title: string;
  children?: ICategory[];
}

interface IFlatCategory {
  _id: string;
  title: string;
  level: number;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ isOpen, onClose, onSuccess, productToEdit }) => {
  const [categories, setCategories] = useState<IFlatCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [openVariantDropdown, setOpenVariantDropdown] = useState<number | null>(null);
  const [styleFiles, setStyleFiles] = useState<{ [key: number]: File[] }>({});

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
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const cats = response.data || [];
        const flatCategories: IFlatCategory[] = [];
        const flatten = (items: ICategory[], level = 0) => {
          items.forEach((cat) => {
            flatCategories.push({ _id: cat._id, title: cat.title, level });
            if (cat.children && cat.children.length > 0) {
              flatten(cat.children, level + 1);
            }
          });
        };
        flatten(cats);
        setCategories(flatCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    if (isOpen) {
      fetchCategories();
      
      if (productToEdit) {
        reset({
          title: productToEdit.title,
          description: productToEdit.description,
          brand: productToEdit.brand || "",
          categoryIds: productToEdit.categoryIds ? productToEdit.categoryIds.map((c) => typeof c === "object" && c !== null && "_id" in c ? c._id : c) : [],
          gender: productToEdit.gender,
          weight: productToEdit.weight,
          price: productToEdit.price,
          discountPercentage: productToEdit.discountPercentage,
          isActive: productToEdit.isActive,
          isFeatured: productToEdit.isFeatured,
          productStyles: productToEdit.productStyles.map(s => ({
            colorName: s.colorName,
            colorHex: s.colorHex,
            images: s.images || [],
            isDefault: s.isDefault
          })),
          variants: productToEdit.variants.map(v => ({
            sku: v.sku,
            colorName: v.colorName,
            size: v.size,
            stock: v.stock,
            priceDifference: v.priceDifference
          }))
        });
      } else {
        reset({
          isActive: true,
          isFeatured: false,
          gender: "unisex",
          weight: 0,
          price: 0,
          discountPercentage: 0,
          categoryIds: [],
          productStyles: [{ colorName: "", colorHex: "#000000", images: [], isDefault: true }],
          variants: [{ sku: "", colorName: "", size: "", stock: 0, priceDifference: 0 }],
        });
        setStyleFiles({});
      }
    }
  }, [isOpen, productToEdit, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const uploadedStyles = await Promise.all(
        data.productStyles.map(async (style, index) => {
          const files = styleFiles[index] || [];
          if (files.length > 0) {
            return await uploadService.uploadImages(files);
          }
          return [];
        })
      );

      const payload = {
        ...data,
        productStyles: data.productStyles.map((style, index) => {
          const existingImages = style.images || [];
          return {
            ...style,
            images: [...existingImages, ...(uploadedStyles[index] || [])],
          };
        }),
      };

      if (productToEdit) {
        await productService.updateProduct(productToEdit.slug, payload);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload);
        toast.success("Thêm sản phẩm thành công!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
      if ((error as IJsonFail).message) {
        toast.error((error as IJsonFail).message);
      } else {
        toast.error("Đã xảy ra lỗi khi lưu sản phẩm");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Ảnh ${file.name} vượt quá dung lượng 5MB`);
          return false;
        }
        return true;
      });
      if (newFiles.length > 0) {
        setStyleFiles((prev) => {
          const currentFiles = prev[index] || [];
          const combined = [...currentFiles, ...newFiles].slice(0, 5);
          return { ...prev, [index]: combined };
        });
      }
    }
    if (e.target) e.target.value = "";
  };

  const generateSku = (index: number) => {
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    setValue(`variants.${index}.sku`, `SKU-${randomStr}`);
  };

  const removeFile = (styleIndex: number, fileIndex: number) => {
    setStyleFiles((prev) => {
      const currentFiles = prev[styleIndex] || [];
      const updated = [...currentFiles];
      updated.splice(fileIndex, 1);
      return { ...prev, [styleIndex]: updated };
    });
  };

  const removeExistingImage = (styleIndex: number, imageIndex: number) => {
    const currentStyles = watch("productStyles");
    const updatedStyles = [...currentStyles];
    if (updatedStyles[styleIndex].images) {
      updatedStyles[styleIndex].images.splice(imageIndex, 1);
      setValue(`productStyles.${styleIndex}.images`, updatedStyles[styleIndex].images);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-[0_0_50px_rgba(0,0,0,0.08)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-20">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] block">
                  {productToEdit ? "Sửa thông tin" : "Add New Item"}
                </span>
                <h3 className="text-2xl font-light text-neutral-900 tracking-tight">
                  {productToEdit ? "Cập nhật sản phẩm" : "Sản phẩm mới"}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Hủy bỏ
                </button>
                {/* FIX 4: Gắn type submit và nối với thẻ form qua thuộc tính form="..." */}
                <button
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neutral-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Xuất bản sản phẩm"
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-900 mb-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-900">Đang tạo sản phẩm...</p>
                  <p className="text-[10px] font-medium tracking-wide text-neutral-500 mt-2">Vui lòng đợi trong giây lát</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {/* FIX 3: Gắn id, nối sự kiện onSubmit vào đúng thẻ form */}
              <form 
                id="product-form" 
                onSubmit={handleSubmit(onSubmit, (errors) => {
                  console.log("Lỗi form:", errors);
                  toast.error("Vui lòng kiểm tra lại! Bạn chưa điền đủ các thông tin bắt buộc.");
                })}
                className="p-10 space-y-16 pb-20"
              >
                
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
                        className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                        placeholder="VD: Áo Thun Nam Cổ Tròn"
                      />
                      {errors.title && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mô tả sản phẩm</label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full bg-white border border-neutral-200 rounded-sm p-4 text-sm font-light outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none"
                        placeholder="Mô tả chi tiết về chất liệu, kiểu dáng và cách bảo quản..."
                      />
                      {errors.description && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Danh mục</label>
                        <div className="relative">
                          <div 
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                            className={cn(
                              "w-full bg-white border rounded-sm px-4 py-3 text-sm transition-all flex items-center justify-between cursor-pointer gap-2",
                              isCategoryDropdownOpen ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-300",
                              (!watch("categoryIds") || watch("categoryIds").length === 0) ? "text-neutral-300 font-light" : "font-medium text-neutral-900"
                            )}
                          >
                            <span className="truncate flex-1 text-left pr-2">
                              {watch("categoryIds") && watch("categoryIds").length > 0
                                ? watch("categoryIds")
                                    .map((id: string) => categories.find((c) => c._id === id)?.title)
                                    .filter(Boolean)
                                    .join(", ") 
                                : "Chọn danh mục"}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform shrink-0", isCategoryDropdownOpen && "rotate-180")} />
                          </div>

                          <AnimatePresence>
                            {isCategoryDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setIsCategoryDropdownOpen(false)} 
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-100 shadow-xl rounded-sm z-50 max-h-60 overflow-y-auto custom-scrollbar p-2"
                                >
                                  {categories.length === 0 ? (
                                    <div className="p-3 text-xs text-neutral-400 text-center">Không có danh mục</div>
                                  ) : (
                                    categories.map((cat) => (
                                      <div
                                        key={cat._id}
                                        onClick={() => {
                                          const currentIds = watch("categoryIds") || [];
                                          const newIds = currentIds.includes(cat._id)
                                            ? currentIds.filter((id: string) => id !== cat._id)
                                            : [...currentIds, cat._id];
                                          setValue("categoryIds", newIds, { shouldValidate: true });
                                        }}
                                        className={cn(
                                          "px-3 py-2.5 text-sm cursor-pointer transition-colors rounded-sm flex items-center group gap-2",
                                          (watch("categoryIds") || []).includes(cat._id) ? "bg-neutral-900 text-white font-medium" : "hover:bg-neutral-50 text-neutral-600",
                                          cat.level === 1 && !(watch("categoryIds") || []).includes(cat._id) && "font-medium text-neutral-900"
                                        )}
                                        style={{ paddingLeft: `${(cat.level - 1) * 1.5 + 0.75}rem` }}
                                      >
                                        {cat.level > 1 && <span className={cn("mr-2 opacity-40 group-hover:opacity-100 transition-opacity shrink-0", (watch("categoryIds") || []).includes(cat._id) && "opacity-100 text-white/50")}>└</span>}
                                        <span className="truncate flex-1 text-left">{cat.title}</span>
                                        <div className={cn("w-4 h-4 rounded-sm border flex items-center justify-center shrink-0", (watch("categoryIds") || []).includes(cat._id) ? "border-white bg-white" : "border-neutral-300")}>
                                          {(watch("categoryIds") || []).includes(cat._id) && <span className="w-2 h-2 bg-neutral-900 rounded-sm" />}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        {errors.categoryIds && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.categoryIds.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giới tính</label>
                        <div className="flex bg-neutral-50 p-1 rounded-sm gap-1 border border-neutral-200">
                          {["male", "female", "unisex"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setValue("gender", g as "male" | "female" | "unisex")}
                              className={cn(
                                "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm",
                                watch("gender") === g
                                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/60"
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
                          className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                          placeholder="VD: TenClothes"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <DollarSign className="w-4 h-4 text-neutral-900" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-900">
                      Định giá & Vận chuyển
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giá niêm yết (VND)</label>
                      <input
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                        placeholder="VD: 59"
                      />
                      {errors.price && <p className="text-[10px] text-red-500 font-medium tracking-wide uppercase mt-1">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Giảm giá (%)</label>
                      <input
                        type="number"
                        {...register("discountPercentage", { valueAsNumber: true })}
                        className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                        placeholder="VD: 10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Trọng lượng (g)</label>
                      <input
                        type="number"
                        {...register("weight", { valueAsNumber: true })}
                        className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                        placeholder="VD: 350"
                      />
                    </div>
                  </div>
                </section>

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
                              placeholder="VD: Trắng Sữa"
                              className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mã màu (Hex)</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={watch(`productStyles.${index}.colorHex`) || "#000000"}
                                onChange={(e) => setValue(`productStyles.${index}.colorHex`, e.target.value, { shouldValidate: true })}
                                className="h-[46px] w-14 p-1 bg-white border border-neutral-200 rounded-sm cursor-pointer outline-none"
                              />
                              <input
                                {...register(`productStyles.${index}.colorHex` as const)}
                                className="flex-1 bg-white border border-neutral-200 rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all uppercase "
                                placeholder="VD: #FFFFFF"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Hình ảnh (Tối đa 5 ảnh)</label>
                          <div className="grid grid-cols-5 gap-4">
                            {(watch(`productStyles.${index}.images`) || []).map((imgUrl: string, imgIndex: number) => (
                              <div key={`existing-${imgIndex}`} className="aspect-[3/4] bg-neutral-100 rounded-sm relative group/img overflow-hidden border border-neutral-200">
                                <img 
                                  src={imgUrl} 
                                  alt="preview" 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button 
                                    type="button" 
                                    onClick={() => removeExistingImage(index, imgIndex)}
                                    className="p-1.5 bg-white text-neutral-900 rounded-full hover:scale-110 transition-transform"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {(styleFiles[index] || []).map((file, imgIndex) => (
                              <div key={`new-${imgIndex}`} className="aspect-[3/4] bg-neutral-100 rounded-sm relative group/img overflow-hidden">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt="preview" 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button 
                                    type="button" 
                                    onClick={() => removeFile(index, imgIndex)}
                                    className="p-1.5 bg-white text-neutral-900 rounded-full hover:scale-110 transition-transform"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            
                            {((watch(`productStyles.${index}.images`)?.length || 0) + (styleFiles[index]?.length || 0) < 5) && (
                              <label className="aspect-[3/4] bg-white border border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-900 hover:bg-neutral-50 transition-all group/upload">
                                <Upload className="w-5 h-5 text-neutral-300 group-hover/upload:text-neutral-900 transition-colors" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mt-2 text-center px-2">Upload<br/>({5 - ((watch(`productStyles.${index}.images`)?.length || 0) + (styleFiles[index]?.length || 0))} left)</span>
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileSelect(index, e)}
                                />
                              </label>
                            )}

                            {/* FIX 1: Chặn RangeError bằng Math.max */}
                            {Array.from({ length: Math.max(0, 4 - ((watch(`productStyles.${index}.images`)?.length || 0) + (styleFiles[index]?.length || 0))) }).map((_, emptyIndex) => (
                               <div key={`empty-${emptyIndex}`} className="aspect-[3/4] bg-neutral-50 border border-dashed border-neutral-100 rounded-sm" />
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

                  <div className="bg-neutral-50 p-2 border border-neutral-100 relative">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-neutral-50">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 min-w-[130px]">Màu sắc</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Size</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">SKU</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Kho</th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Chênh lệch ($)</th>
                          <th className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantFields.map((field, index) => (
                          <tr key={field.id} className="border-b border-neutral-100 last:border-none group/tr">
                            <td className="p-2">
                              <div className="relative">
                                <div 
                                  onClick={() => setOpenVariantDropdown(openVariantDropdown === index ? null : index)}
                                  className={cn(
                                    "w-full bg-white border rounded-sm px-3 py-2 text-[11px] transition-all flex items-center justify-between cursor-pointer gap-2",
                                    openVariantDropdown === index ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-300",
                                    !watch(`variants.${index}.colorName`) ? "text-neutral-400 font-normal" : "font-medium text-neutral-900"
                                  )}
                                >
                                  <span className="truncate flex-1 text-left">
                                    {watch(`variants.${index}.colorName`) || "Chọn màu"}
                                  </span>
                                  <ChevronDown className={cn("w-3 h-3 text-neutral-400 transition-transform shrink-0", openVariantDropdown === index && "rotate-180")} />
                                </div>

                                <AnimatePresence>
                                  {openVariantDropdown === index && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setOpenVariantDropdown(null)} 
                                      />
                                      <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-neutral-100 shadow-xl rounded-sm z-50 max-h-48 overflow-y-auto custom-scrollbar p-1 min-w-[130px]"
                                      >
                                        <div
                                          onClick={() => {
                                            setValue(`variants.${index}.colorName`, "", { shouldValidate: true });
                                            setOpenVariantDropdown(null);
                                          }}
                                          className={cn(
                                            "px-2 py-1.5 text-[11px] cursor-pointer transition-colors rounded-sm",
                                            !watch(`variants.${index}.colorName`) ? "bg-neutral-900 text-white font-medium" : "hover:bg-neutral-50 text-neutral-600"
                                          )}
                                        >
                                          Chọn màu
                                        </div>
                                        {watch("productStyles").map((s, sIdx) => (
                                          <div
                                            key={s.colorName || `empty-${sIdx}`}
                                            onClick={() => {
                                              if (s.colorName) {
                                                setValue(`variants.${index}.colorName`, s.colorName, { shouldValidate: true });
                                                setOpenVariantDropdown(null);
                                              }
                                            }}
                                            className={cn(
                                              "px-2 py-1.5 text-[11px] cursor-pointer transition-colors rounded-sm flex items-center gap-2",
                                              watch(`variants.${index}.colorName`) === s.colorName && s.colorName ? "bg-neutral-900 text-white font-medium" : "hover:bg-neutral-50 text-neutral-600"
                                            )}
                                          >
                                            <div 
                                              className="w-3 h-3 rounded-full border border-neutral-200 shrink-0"
                                              style={{ backgroundColor: s.colorHex || "#000000" }}
                                            />
                                            <span className="truncate flex-1 text-left">{s.colorName || "Chưa đặt tên"}</span>
                                          </div>
                                        ))}
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                            <td className="p-2">
                              <input 
                                {...register(`variants.${index}.size` as const)}
                                placeholder="VD: S, M, XL" 
                                className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-[11px] font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                              />
                            </td>
                            <td className="p-2">
                              <div className="relative">
                                <input 
                                  {...register(`variants.${index}.sku` as const)}
                                  placeholder="VD: SKU-123" 
                                  className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-[11px] font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all uppercase pr-8"
                                />
                                <button
                                  type="button"
                                  onClick={() => generateSku(index)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 bg-white"
                                  title="Tự động tạo SKU"
                                >
                                  <Wand2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="p-2">
                              <input 
                                type="number"
                                {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                                placeholder="Số lượng"
                                className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-[11px] font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number"
                                {...register(`variants.${index}.priceDifference` as const, { valueAsNumber: true })}
                                placeholder="+/- Giá ($)"
                                className="w-full bg-white border border-neutral-200 rounded-sm px-3 py-2 text-[11px] font-medium outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all "
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