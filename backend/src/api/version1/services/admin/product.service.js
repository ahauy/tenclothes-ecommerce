"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListProductAdminService = exports.batchChangeFeaturedService = exports.batchChangeStatusService = exports.batchDeleteProductsService = exports.getProductHistoryService = exports.restoreProductService = exports.deleteProductService = exports.changeFeaturedProductService = exports.changeStatusProductService = exports.updateProductService = exports.createProductService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("../../../../helpers/slugify"));
const product_model_1 = __importDefault(require("../../../../models/product.model"));
const category_model_1 = require("../../../../models/category.model");
const diff_1 = require("../../../../helpers/diff");
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const writeProductLog_1 = __importDefault(require("../../../../helpers/writeProductLog"));
const productLog_model_1 = __importDefault(require("../../../../models/productLog.model"));
const createProductService = async (productData, staff) => {
    const newProduct = await product_model_1.default.create({
        ...productData,
        slug: (0, slugify_1.default)(productData.title),
    });
    await (0, writeProductLog_1.default)(newProduct._id, "CREATE", staff);
    return newProduct;
};
exports.createProductService = createProductService;
const updateProductService = async (slugKey, productData, staff) => {
    const oldProduct = await product_model_1.default.findOne({ slug: slugKey, deleted: false }).lean();
    if (!oldProduct)
        return null;
    const diff = (0, diff_1.calculateDiff)(oldProduct, productData);
    const updatedData = { ...productData };
    if (productData.title) {
        updatedData.slug = (0, slugify_1.default)(productData.title);
    }
    const product = await product_model_1.default.findOneAndUpdate({ slug: slugKey, deleted: false }, updatedData, { returnDocument: "after" });
    if (product && diff) {
        await (0, writeProductLog_1.default)(product._id, "UPDATE", staff, diff);
    }
    return product;
};
exports.updateProductService = updateProductService;
const changeStatusProductService = async (slug, status, staff) => {
    const product = await product_model_1.default.findOneAndUpdate({ slug }, { isActive: status }, { returnDocument: "after" });
    if (product) {
        await (0, writeProductLog_1.default)(product._id, "CHANGE_STATUS", staff, {
            isActive: { from: !status, to: status },
        });
    }
    return product;
};
exports.changeStatusProductService = changeStatusProductService;
const changeFeaturedProductService = async (slug, isFeatured, staff) => {
    const product = await product_model_1.default.findOneAndUpdate({ slug }, { isFeatured }, { returnDocument: "after" });
    if (product) {
        await (0, writeProductLog_1.default)(product._id, "CHANGE_FEATURED", staff, {
            isFeatured: { from: !isFeatured, to: isFeatured },
        });
    }
    return product;
};
exports.changeFeaturedProductService = changeFeaturedProductService;
const deleteProductService = async (slugKey, staff) => {
    const product = await product_model_1.default.findOneAndUpdate({ slug: slugKey }, { deleted: true, deletedAt: new Date() }, { returnDocument: "after" });
    if (product) {
        await (0, writeProductLog_1.default)(product._id, "DELETE", staff);
    }
    return product;
};
exports.deleteProductService = deleteProductService;
/**
 * Khôi phục sản phẩm đã xóa
 * Phân quyền: Chỉ Admin hoặc Người đã xóa mới có thể khôi phục
 */
const restoreProductService = async (slugKey, staff) => {
    const product = await product_model_1.default.findOne({ slug: slugKey, deleted: true });
    if (!product) {
        return { success: false, message: "Không tìm thấy sản phẩm trong thùng rác!" };
    }
    // Tìm log xóa gần nhất để biết ai đã xóa
    const deleteLog = await productLog_model_1.default.findOne({
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
    await (0, writeProductLog_1.default)(product._id, "RESTORE", staff);
    return { success: true, message: "Khôi phục sản phẩm thành công!", product: product };
};
exports.restoreProductService = restoreProductService;
const getProductHistoryService = async (slugKey) => {
    const product = await product_model_1.default.findOne({ slug: slugKey, deleted: false });
    if (!product) {
        throw new ApiError_1.default(404, "Không tìm thấy sản phẩm");
    }
    return await productLog_model_1.default.find({ productId: product._id })
        .populate("performedBy", "email fullName role")
        .sort({ createdAt: -1 })
        .lean();
};
exports.getProductHistoryService = getProductHistoryService;
/**
 * Xóa hàng loạt sản phẩm (soft delete)
 */
const batchDeleteProductsService = async (slugs, staff) => {
    const products = await product_model_1.default.find({ slug: { $in: slugs }, deleted: false })
        .select("_id slug")
        .lean();
    if (products.length === 0) {
        throw new ApiError_1.default(404, "Không tìm thấy sản phẩm nào để xóa");
    }
    await product_model_1.default.updateMany({ slug: { $in: slugs }, deleted: false }, { deleted: true, deletedAt: new Date() });
    // Ghi log cho từng sản phẩm
    const logPromises = products.map((p) => (0, writeProductLog_1.default)(p._id, "BATCH_DELETE", staff));
    await Promise.all(logPromises);
    return { deletedCount: products.length };
};
exports.batchDeleteProductsService = batchDeleteProductsService;
/**
 * Thay đổi trạng thái hàng loạt
 */
const batchChangeStatusService = async (slugs, status, staff) => {
    const products = await product_model_1.default.find({ slug: { $in: slugs }, deleted: false })
        .select("_id slug isActive")
        .lean();
    if (products.length === 0) {
        throw new ApiError_1.default(404, "Không tìm thấy sản phẩm nào để cập nhật");
    }
    await product_model_1.default.updateMany({ slug: { $in: slugs }, deleted: false }, { isActive: status });
    const logPromises = products.map((p) => (0, writeProductLog_1.default)(p._id, "CHANGE_STATUS", staff, {
        isActive: { from: p.isActive, to: status },
    }));
    await Promise.all(logPromises);
    return { updatedCount: products.length };
};
exports.batchChangeStatusService = batchChangeStatusService;
/**
 * Thay đổi nổi bật hàng loạt
 */
const batchChangeFeaturedService = async (slugs, isFeatured, staff) => {
    const products = await product_model_1.default.find({ slug: { $in: slugs }, deleted: false })
        .select("_id slug isFeatured")
        .lean();
    if (products.length === 0) {
        throw new ApiError_1.default(404, "Không tìm thấy sản phẩm nào để cập nhật");
    }
    await product_model_1.default.updateMany({ slug: { $in: slugs }, deleted: false }, { isFeatured });
    const logPromises = products.map((p) => (0, writeProductLog_1.default)(p._id, "CHANGE_FEATURED", staff, {
        isFeatured: { from: p.isFeatured, to: isFeatured },
    }));
    await Promise.all(logPromises);
    return { updatedCount: products.length };
};
exports.batchChangeFeaturedService = batchChangeFeaturedService;
const getListProductAdminService = async (queryFilter) => {
    const { page = 1, limit = 10, keyword, isActive, isFeatured, categoryId, sort, startDate, endDate, minPrice, maxPrice, minStock, maxStock, isTrash = "false" } = queryFilter;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const pipeline = [];
    // 1. Xử lý tìm kiếm chuyên nghiệp (Atlas Search hoặc Fallback)
    if (keyword) {
        const normalizedKeyword = keyword.normalize("NFC").trim();
        const searchTerms = normalizedKeyword.split(/\s+/);
        let minMatch = searchTerms.length;
        if (searchTerms.length >= 3)
            minMatch = searchTerms.length - 1;
        const shouldClauses = searchTerms.map((term) => ({
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
        });
    }
    // 2. Xử lý bộ lọc (Match Conditions)
    const matchConditions = { deleted: isTrash === "true" };
    if (isActive !== undefined)
        matchConditions["isActive"] = isActive === "true";
    if (isFeatured !== undefined)
        matchConditions["isFeatured"] = isFeatured === "true";
    // Xử lý cây danh mục (Category Hierarchy)
    if (categoryId) {
        const allCategories = await category_model_1.Category.find({ deleted: false }).select("_id parentId").lean();
        const getSubCategoryIds = (pId) => {
            const subs = allCategories.filter(cat => String(cat.parentId) === String(pId));
            let subIds = subs.map(cat => String(cat._id));
            for (const sub of subs) {
                subIds = [...subIds, ...getSubCategoryIds(String(sub._id))];
            }
            return subIds;
        };
        const categoryIds = [categoryId, ...getSubCategoryIds(categoryId)].map(id => new mongoose_1.default.Types.ObjectId(id));
        matchConditions["categoryIds"] = { $in: categoryIds };
    }
    // Lọc giá & tồn kho
    if (minPrice || maxPrice) {
        const priceCond = {};
        if (minPrice)
            priceCond["$gte"] = Number(minPrice);
        if (maxPrice)
            priceCond["$lte"] = Number(maxPrice);
        matchConditions["price"] = priceCond;
    }
    if (minStock || maxStock) {
        const stockCond = {};
        if (minStock)
            stockCond["$gte"] = Number(minStock);
        if (maxStock)
            stockCond["$lte"] = Number(maxStock);
        matchConditions["totalStock"] = stockCond;
    }
    // Lọc thời gian
    if (startDate || endDate) {
        const dateCond = {};
        if (startDate)
            dateCond["$gte"] = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateCond["$lte"] = end;
        }
        matchConditions["createdAt"] = dateCond;
    }
    pipeline.push({ $match: matchConditions });
    // 3. Xử lý sắp xếp (Sorting)
    let sortObj = { createdAt: -1 };
    if (sort) {
        const isDesc = sort.startsWith("-");
        const field = isDesc ? sort.substring(1) : sort;
        sortObj = { [field]: isDesc ? -1 : 1 };
    }
    else if (keyword) {
        sortObj = null;
    }
    // 4. Facet Pipeline để lấy Metadata và Data cùng lúc
    const dataPipeline = [];
    if (sortObj)
        dataPipeline.push({ $sort: sortObj });
    dataPipeline.push({ $skip: skip }, { $limit: limitNum });
    dataPipeline.push({
        $lookup: {
            from: "categories",
            localField: "categoryIds",
            foreignField: "_id",
            as: "categoryIds"
        }
    }, {
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
    });
    pipeline.push({
        $facet: {
            metadata: [{ $count: "total" }],
            data: dataPipeline,
        },
    });
    try {
        const result = await product_model_1.default.aggregate(pipeline);
        const totalProducts = result[0].metadata[0]?.total || 0;
        const products = result[0].data;
        const totalPages = Math.ceil(totalProducts / limitNum);
        return {
            products,
            currentPage: pageNum,
            totalPages,
            totalProducts,
        };
    }
    catch (error) {
        console.warn("[Admin Search] Fallback to Regex search:", error instanceof Error ? error.message : "Unknown error");
        // Type casting to access the custom search stage
        const fallbackPipeline = pipeline.filter(stage => !('$search' in stage));
        if (keyword) {
            const regex = new RegExp(keyword.trim(), "i");
            const matchStage = fallbackPipeline.find(stage => '$match' in stage);
            if (matchStage) {
                matchStage.$match["$or"] = [
                    { title: regex },
                    { brand: regex },
                    { tags: regex },
                    { "variants.sku": regex }
                ];
            }
        }
        const result = await product_model_1.default.aggregate(fallbackPipeline);
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
exports.getListProductAdminService = getListProductAdminService;
//# sourceMappingURL=product.service.js.map