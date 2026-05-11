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
const controller = __importStar(require("../../controllers/client/auth.controller"));
// import { limiter } from '../../../../middlewares/rateLimit.middlewares';
const validate_middlewares_1 = require("../../../../middlewares/validate.middlewares");
const auth_validator_1 = require("../../validators/client/auth.validator");
const loginSchema_validate_1 = require("../../validators/shared/loginSchema.validate");
const auth_shareController_1 = require("../../controllers/shared/auth.shareController");
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const authRoutesClient = express_1.default.Router();
authRoutesClient.post("/register", (0, validate_middlewares_1.validate)(auth_validator_1.registerSchema), controller.registerController);
authRoutesClient.post("/login", (0, validate_middlewares_1.validate)(loginSchema_validate_1.loginSchema), (0, auth_shareController_1.loginShareController)(user_model_1.default));
authRoutesClient.post("/refresh-token", (0, auth_shareController_1.refreshShareController)());
authRoutesClient.post("/logout", (0, auth_shareController_1.logoutShareController)());
exports.default = authRoutesClient;
//# sourceMappingURL=auth.routes.js.map