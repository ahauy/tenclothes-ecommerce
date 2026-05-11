"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const mainV1RoutesAdmin = (app) => {
    const apiVersion1Admin = "/api/version1/admin";
    app.use(`${apiVersion1Admin}/auth`, auth_routes_1.default);
    app.use(`${apiVersion1Admin}/products`, product_routes_1.default);
    app.use(`${apiVersion1Admin}/orders`, order_routes_1.default);
    app.use(`${apiVersion1Admin}/upload`, upload_routes_1.default);
    app.use(`${apiVersion1Admin}/category`, category_routes_1.default);
};
exports.default = mainV1RoutesAdmin;
//# sourceMappingURL=index.routes.js.map