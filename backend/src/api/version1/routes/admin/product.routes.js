"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller = __importStar(require("../../controllers/admin/product.controller"));
const authen_middlewares_1 = require("../../../../middlewares/authen.middlewares");
const authorize_middlewares_1 = require("../../../../middlewares/authorize.middlewares");
const validate_middlewares_1 = require("../../../../middlewares/validate.middlewares");
const product_validator_1 = require("../../validators/admin/product.validator");
// import { upload, uploadToCloudinary } from "../../../../helpers/uploadToCloudinary"
const productRouter = express_1.default.Router();
productRouter.get("/", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.getListProductAdminController);
productRouter.post("/create", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), (0, validate_middlewares_1.validate)(product_validator_1.createProductSchema), controller.createProductController);
productRouter.patch("/update/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), (0, validate_middlewares_1.validate)(product_validator_1.createProductSchema), controller.updateProductController);
productRouter.patch("/change-status/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.changeStatusProductController);
productRouter.patch("/change-featured/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.changeFeaturedProductController);
productRouter.delete("/delete/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.deleteProductController);
productRouter.patch("/restore/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin', 'employee']), controller.restoreProductController);
productRouter.get("/history/:slug", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin', 'employee']), controller.getProductHistoryController);
// Batch Operations
productRouter.patch("/batch/change-status", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.batchChangeStatusController);
productRouter.patch("/batch/change-featured", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.batchChangeFeaturedController);
productRouter.post("/batch/delete", authen_middlewares_1.verifyToken, (0, authorize_middlewares_1.authorizationRole)(['admin']), controller.batchDeleteProductsController);
exports.default = productRouter;
//# sourceMappingURL=product.routes.js.map