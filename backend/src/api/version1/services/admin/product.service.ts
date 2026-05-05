import mongoose from "mongoose";
import slug from "../../../../helpers/slugify";
import { IProduct } from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";
import { Category } from "../../../../models/category.model";
import { calculateDiff } from "../../../../helpers/diff";
import { ICreateProductReqBody } from "../../validators/admin/product.validator";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";
import ApiError from "../../../../helpers/ApiError";
import writeProductLog, { IStaffReq } from "../../../../helpers/writeProductLog";
import ProductLog from "../../../../models/productLog.model";


export const createProductService = async (
  productData: ICreateProductReqBody,
  staff: IStaffReq
): Promise<IProduct> => {
  const newProduct = await Product.create({
    ...productData,
    slug: slug(productData.title),
  } as unknown as Record<string, unknown>);

  await writeProductLog(newProduct._id, "CREATE", staff);

  return newProduct as unknown as IProduct;
};

export const updateProductService = async (
  slugKey: string,
  productData: ICreateProductReqBody,
  staff: IStaffReq
): Promise<IProduct | null> => {
  const oldProduct = await Product.findOne({ slug: slugKey, deleted: false }).lean();
  if (!oldProduct) return null;

  const diff = calculateDiff(oldProduct, productData);

  const updatedData: Partial<ICreateProductReqBody> & { slug?: string } = { ...productData };
  if (productData.title) {
    updatedData.slug = slug(productData.title);
  }

  const product = await Product.findOneAndUpdate(
    { slug: slugKey, deleted: false },
    updatedData,
    { returnDocument: "after" }
  );

  if (product && diff) {
    await writeProductLog(product._id, "UPDATE", staff, diff as Record<string, { from?: unknown; to?: unknown }>);
  }

  return product as unknown as IProduct;
};

export const changeStatusProductService = async (
  slug: string,
  status: boolean,
  staff: IStaffReq
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { isActive: status },
    { returnDocument: "after" }
  );

  if (product) {
    await writeProductLog(product._id, "CHANGE_STATUS", staff, {
      isActive: { from: !status, to: status },
    });
  }

  return product as unknown as IProduct;
};

export const changeFeaturedProductService = async (
  slug: string,
  isFeatured: boolean,
  staff: IStaffReq
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug },
    { isFeatured },
    { returnDocument: "after" }
  );

  if (product) {
    await writeProductLog(product._id, "CHANGE_FEATURED", staff, {
      isFeatured: { from: !isFeatured, to: isFeatured },
    });
  }

  return product as unknown as IProduct;
};

export const deleteProductService = async (
  slugKey: string,
  staff: IStaffReq
): Promise<IProduct | null> => {
  const product = await Product.findOneAndUpdate(
    { slug: slugKey },
    { deleted: true, deletedAt: new Date() },
    { returnDocument: "after" }
  );

  if (product) {
    await writeProductLog(product._id, "DELETE", staff);
  }

  return product as unknown as IProduct;
};

/**
 * Khôi phục sản phẩm đã xóa
 * Phân quyền: Chỉ Admin hoặc Người đã xóa mới có thể khôi phục
 */
export const restoreProductService = async (
  slugKey: string,
  staff: IStaffReq
): Promise<{ success: boolean; message: string; product?: IProduct }> => {
  const product = await Product.findOne({ slug: slugKey, deleted: true });
  if (!product) {
    return { success: false, message: "Không tìm thấy sản phẩm trong thùng rác!" };
  }

  // Tìm log xóa gần nhất để biết ai đã xóa
  const deleteLog = await ProductLog.findOne({
    productId: product._id,
    action: "DELETE",
  }).sort({ createdAt: -1 });

  const isAdmin = staff.role === "admin";
  const isDeleter = deleteLog && String(deleteLog.performedBy) === String(staff._id);

  if (!isAdmin && !isDeleter) {
    return {
      success: false,
      message: "Bạn không có quyền khôi phục sản phẩm này (Chỉ Admin hoặc người đã xóa mới có quyền)!",
    };
  }

  product.deleted = false;
  product.deletedAt = null;
  await product.save();

  await writeProductLog(product._id, "RESTORE", staff);

  return { success: true, message: "Khôi phục sản phẩm thành công!", product: product as unknown as IProduct };
};

export const getProductHistoryService = async (slugKey: string) => {
  const product = await Product.findOne({ slug: slugKey, deleted: false });
  if (!product) {
    throw new ApiError(404, "Không tìm thấy sản phẩm");
  }
  return await ProductLog.find({ productId: product._id })
    .populate("performedBy", "email fullName role")
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Xóa hàng loạt sản phẩm (soft delete)
 */
export const batchDeleteProductsService = async (
  slugs: string[],
  staff: IStaffReq
): Promise<{ deletedCount: number }> => {
  const products = await Product.find({ slug: { $in: slugs }, deleted: false })
    .select("_id slug")
    .lean();

  if (products.length === 0) {
    throw new ApiError(404, "Không tìm thấy sản phẩm nào để xóa");
  }

  await Product.updateMany(
    { slug: { $in: slugs }, deleted: false },
    { deleted: true, deletedAt: new Date() }
  );

  // Ghi log cho từng sản phẩm
  const logPromises = products.map((p) =>
    writeProductLog(p._id, "BATCH_DELETE", staff)
  );
  await Promise.all(logPromises);

  return { deletedCount: products.length };
};

/**
 * Thay đổi trạng thái hàng loạt
 */
export const batchChangeStatusService = async (
  slugs: string[],
  status: boolean,
  staff: IStaffReq
): Promise<{ updatedCount: number }> => {
  const products = await Product.find({ slug: { $in: slugs }, deleted: false })
    .select("_id slug isActive")
    .lean();

  if (products.length === 0) {
    throw new ApiError(404, "Không tìm thấy sản phẩm nào để cập nhật");
  }

  await Product.updateMany(
    { slug: { $in: slugs }, deleted: false },
    { isActive: status }
  );

  const logPromises = products.map((p) =>
    writeProductLog(p._id, "CHANGE_STATUS", staff, {
      isActive: { from: p.isActive, to: status },
    })
  );
  await Promise.all(logPromises);

  return { updatedCount: products.length };
};

/**
 * Thay đổi nổi bật hàng loạt
 */
export const batchChangeFeaturedService = async (
  slugs: string[],
  isFeatured: boolean,
  staff: IStaffReq
): Promise<{ updatedCount: number }> => {
  const products = await Product.find({ slug: { $in: slugs }, deleted: false })
    .select("_id slug isFeatured")
    .lean();

  if (products.length === 0) {
    throw new ApiError(404, "Không tìm thấy sản phẩm nào để cập nhật");
  }

  await Product.updateMany(
    { slug: { $in: slugs }, deleted: false },
    { isFeatured }
  );

  const logPromises = products.map((p) =>
    writeProductLog(p._id, "CHANGE_FEATURED", staff, {
      isFeatured: { from: p.isFeatured, to: isFeatured },
    })
  );
  await Promise.all(logPromises);

  return { updatedCount: products.length };
};

export const getListProductAdminService = async (queryFilter: IRequestQueryFilter) => {
  const {
    page = 1,
    limit = 10,
    keyword,
    isActive,
    isFeatured,
    categoryId,
    sort,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
    isTrash = "false"
  } = queryFilter;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const pipeline: mongoose.PipelineStage[] = [];

  // 1. Xử lý tìm kiếm chuyên nghiệp (Atlas Search hoặc Fallback)
  if (keyword) {
    const normalizedKeyword = keyword.normalize("NFC").trim();
    const searchTerms = normalizedKeyword.split(/\s+/);
    let minMatch = searchTerms.length;
    if (searchTerms.length >= 3) minMatch = searchTerms.length - 1;

    const shouldClauses = searchTerms.map((term: string) => ({
      text: {
        query: term,
        path: ["title", "brand", "tags", "variants.sku"],
        fuzzy: { maxEdits: 1 }
      },
    }));

    pipeline.push({
      $search: {
        index: "default",
        compound: {
          should: shouldClauses,
          minimumShouldMatch: minMatch,
        },
      },
    } as mongoose.PipelineStage);
  }

  // 2. Xử lý bộ lọc (Match Conditions)
  const matchConditions: Record<string, unknown> = { deleted: isTrash === "true" };

  if (isActive !== undefined) matchConditions["isActive"] = isActive === "true";
  if (isFeatured !== undefined) matchConditions["isFeatured"] = isFeatured === "true";

  // Xử lý cây danh mục (Category Hierarchy)
  if (categoryId) {
    const allCategories = await Category.find({ deleted: false }).select("_id parentId").lean();
    
    const getSubCategoryIds = (pId: string): string[] => {
      const subs = allCategories.filter(cat => String(cat.parentId) === String(pId));
      let subIds = subs.map(cat => String(cat._id));
      for (const sub of subs) {
        subIds = [...subIds, ...getSubCategoryIds(String(sub._id))];
      }
      return subIds;
    };

    const categoryIds = [categoryId, ...getSubCategoryIds(categoryId)].map(id => new mongoose.Types.ObjectId(id));
    matchConditions["categoryIds"] = { $in: categoryIds };
  }

  // Lọc giá & tồn kho
  if (minPrice || maxPrice) {
    const priceCond: Record<string, number> = {};
    if (minPrice) priceCond["$gte"] = Number(minPrice);
    if (maxPrice) priceCond["$lte"] = Number(maxPrice);
    matchConditions["price"] = priceCond;
  }

  if (minStock || maxStock) {
    const stockCond: Record<string, number> = {};
    if (minStock) stockCond["$gte"] = Number(minStock);
    if (maxStock) stockCond["$lte"] = Number(maxStock);
    matchConditions["totalStock"] = stockCond;
  }

  // Lọc thời gian
  if (startDate || endDate) {
    const dateCond: Record<string, Date> = {};
    if (startDate) dateCond["$gte"] = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateCond["$lte"] = end;
    }
    matchConditions["createdAt"] = dateCond;
  }

  pipeline.push({ $match: matchConditions });

  // 3. Xử lý sắp xếp (Sorting)
  let sortObj: Record<string, 1 | -1> | null = { createdAt: -1 };
  if (sort) {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.substring(1) : sort;
    sortObj = { [field]: isDesc ? -1 : 1 };
  } else if (keyword) {
    sortObj = null;
  }

  // 4. Facet Pipeline để lấy Metadata và Data cùng lúc
  const dataPipeline: mongoose.PipelineStage.FacetPipelineStage[] = [];
  if (sortObj) dataPipeline.push({ $sort: sortObj } as mongoose.PipelineStage.FacetPipelineStage);
  dataPipeline.push({ $skip: skip } as mongoose.PipelineStage.FacetPipelineStage, { $limit: limitNum } as mongoose.PipelineStage.FacetPipelineStage);

  dataPipeline.push({
    $lookup: {
      from: "categories",
      localField: "categoryIds",
      foreignField: "_id",
      as: "categoryIds"
    }
  } as mongoose.PipelineStage.FacetPipelineStage, {
    $project: {
      __v: 0,
      "categories.deleted": 0,
      "categories.isActive": 0,
      "categories.parentId": 0,
      "categories.slug": 0,
      "categories.description": 0,
      "categories.thumbnail": 0,
      "categories.createdAt": 0,
      "categories.updatedAt": 0,
      "categories.__v": 0
    }
  } as mongoose.PipelineStage.FacetPipelineStage);

  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: dataPipeline as mongoose.PipelineStage.FacetPipelineStage[], 
    },
  } as mongoose.PipelineStage);

  try {
    const result = await Product.aggregate(pipeline);
    const totalProducts = result[0].metadata[0]?.total || 0;
    const products = result[0].data;
    const totalPages = Math.ceil(totalProducts / limitNum);

    return {
      products,
      currentPage: pageNum,
      totalPages,
      totalProducts,
    };
  } catch (error: unknown) {
    console.warn("[Admin Search] Fallback to Regex search:", error instanceof Error ? error.message : "Unknown error");
    
    // Type casting to access the custom search stage
    const fallbackPipeline = pipeline.filter(stage => !('$search' in stage));
    
    if (keyword) {
      const regex = new RegExp(keyword.trim(), "i");
      const matchStage = fallbackPipeline.find(stage => '$match' in stage) as { $match: Record<string, unknown> } | undefined;
      if (matchStage) {
        matchStage.$match["$or"] = [
          { title: regex },
          { brand: regex },
          { tags: regex },
          { "variants.sku": regex }
        ];
      }
    }

    const result = await Product.aggregate(fallbackPipeline);
    const totalProducts = result[0]?.metadata?.[0]?.total || 0;
    const products = result[0]?.data || [];
    const totalPages = Math.ceil(totalProducts / limitNum);

    return {
      products,
      currentPage: pageNum,
      totalPages,
      totalProducts,
    };
  }
};
