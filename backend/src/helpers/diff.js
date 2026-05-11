"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiff = void 0;
/**
 * So sánh hai object và trả về các trường khác biệt
 * Phục vụ việc ghi log lịch sử thay đổi sản phẩm
 */
const calculateDiff = (oldData, newData) => {
    const changes = {};
    // Các trường quan trọng cần theo dõi
    const trackFields = [
        "title",
        "description",
        "price",
        "discountPercentage",
        "isActive",
        "isFeatured",
        "brand",
        "gender",
        "categoryIds",
        "weight",
    ];
    trackFields.forEach((field) => {
        const oldVal = oldData[field];
        const newVal = newData[field];
        // Xử lý so sánh mảng (categoryIds)
        if (Array.isArray(oldVal) && Array.isArray(newVal)) {
            const oldStr = JSON.stringify(oldVal.map((v) => String(v)).sort());
            const newStr = JSON.stringify(newVal.map((v) => String(v)).sort());
            if (oldStr !== newStr) {
                changes[field] = { from: oldVal, to: newVal };
            }
            return;
        }
        // Xử lý so sánh giá trị nguyên thủy
        if (newVal !== undefined && newVal !== oldVal) {
            changes[field] = { from: oldVal, to: newVal };
        }
    });
    return Object.keys(changes).length > 0 ? changes : null;
};
exports.calculateDiff = calculateDiff;
//# sourceMappingURL=diff.js.map