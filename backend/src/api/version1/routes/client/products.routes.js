"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../../controllers/client/product.controller");
const productControllerClient = express_1.default.Router();
productControllerClient.get("/category/:slug", product_controller_1.getListProduct);
productControllerClient.get("/category/:slug/filters", product_controller_1.getCategoryFilters);
productControllerClient.get("/latest-collection", product_controller_1.getLatestCollection);
productControllerClient.get("/best-selling", product_controller_1.getBestSelling);
productControllerClient.get("/related-collection", product_controller_1.getRelatedProducts);
productControllerClient.get("/search", product_controller_1.searchProducts);
productControllerClient.get("/:slug", product_controller_1.getProductDetail);
exports.default = productControllerClient;
//# sourceMappingURL=products.routes.js.map