"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const checkout_routes_1 = __importDefault(require("./checkout.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const coupon_routes_1 = __importDefault(require("./coupon.routes"));
const mainV1RoutesClient = (app) => {
    const apiVersion1 = "/api/version1";
    app.use(`${apiVersion1}/auth`, auth_routes_1.default);
    app.use(`${apiVersion1}/products`, products_routes_1.default);
    app.use(`${apiVersion1}/orders`, order_routes_1.default);
    app.use(`${apiVersion1}/checkout`, checkout_routes_1.default);
    app.use(`${apiVersion1}/cart`, cart_routes_1.default);
    app.use(`${apiVersion1}/category`, category_routes_1.default);
    app.use(`${apiVersion1}/reviews`, review_routes_1.default);
    app.use(`${apiVersion1}/users`, user_routes_1.default);
    app.use(`${apiVersion1}/coupons`, coupon_routes_1.default);
};
exports.default = mainV1RoutesClient;
//# sourceMappingURL=index.routes.js.map