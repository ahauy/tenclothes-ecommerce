"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const slug = (str) => {
    const slugStr = (0, slugify_1.default)(str, {
        replacement: "-",
        lower: true,
        locale: "vi",
        trim: true,
    });
    return slugStr;
};
exports.default = slug;
//# sourceMappingURL=slugify.js.map