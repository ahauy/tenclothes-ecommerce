"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middlewares_1 = require("../../../../middlewares/validate.middlewares");
const loginSchema_validate_1 = require("../../validators/shared/loginSchema.validate");
const auth_shareController_1 = require("../../controllers/shared/auth.shareController");
const account_model_1 = __importDefault(require("../../../../models/account.model"));
const authRoutesAdmin = express_1.default.Router();
authRoutesAdmin.post("/login", (0, validate_middlewares_1.validate)(loginSchema_validate_1.loginSchema), (0, auth_shareController_1.loginShareController)(account_model_1.default));
authRoutesAdmin.post("/refresh-token", (0, auth_shareController_1.refreshShareController)());
authRoutesAdmin.post("/logout", (0, auth_shareController_1.logoutShareController)());
exports.default = authRoutesAdmin;
//# sourceMappingURL=auth.routes.js.map