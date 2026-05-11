"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCategoryTree = void 0;
const buildCategoryTree = (categories, parentId = null // Nên gán default parameter là null ở đây
) => {
    return categories
        .filter((cat) => String(cat.parentId) === String(parentId))
        .map((cat) => {
        return {
            ...cat,
            children: (0, exports.buildCategoryTree)(categories, cat._id),
        };
    });
};
exports.buildCategoryTree = buildCategoryTree;
//# sourceMappingURL=buildCategoryTree.js.map