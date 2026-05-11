"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryTreeClientService = void 0;
const buildCategoryTree_1 = require("../../../../helpers/buildCategoryTree");
const category_model_1 = require("../../../../models/category.model");
const categoryTreeClientService = async () => {
    const categories = await category_model_1.Category.find({
        deleted: false,
        isActive: true,
    })
        .select("_id title slug level thumbnail parentId")
        .lean();
    const categoryTree = (0, buildCategoryTree_1.buildCategoryTree)(categories, null);
    return categoryTree;
};
exports.categoryTreeClientService = categoryTreeClientService;
//# sourceMappingURL=category.service.js.map