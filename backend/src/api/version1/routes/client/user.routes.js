"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authen_middlewares_1 = require("../../../../middlewares/authen.middlewares");
const validate_middlewares_1 = require("../../../../middlewares/validate.middlewares");
const user_controller_1 = require("../../controllers/client/user.controller");
const user_validator_1 = require("../../validators/client/user.validator");
const userRoutesClient = express_1.default.Router();
// Tất cả routes đều yêu cầu xác thực
userRoutesClient.use(authen_middlewares_1.verifyToken);
// ---- Profile ----
// GET /api/version1/users/profile — Lấy thông tin hồ sơ
userRoutesClient.get("/profile", user_controller_1.getProfileController);
// PATCH /api/version1/users/profile — Cập nhật thông tin cá nhân
userRoutesClient.patch("/profile", (0, validate_middlewares_1.validate)(user_validator_1.updateProfileSchema), user_controller_1.updateProfileController);
// PATCH /api/version1/users/change-password — Đổi mật khẩu
userRoutesClient.patch("/change-password", (0, validate_middlewares_1.validate)(user_validator_1.changePasswordSchema), user_controller_1.changePasswordController);
// ---- Addresses ----
// GET /api/version1/users/addresses — Lấy danh sách địa chỉ
userRoutesClient.get("/addresses", user_controller_1.getAddressesController);
// POST /api/version1/users/addresses — Thêm địa chỉ mới
userRoutesClient.post("/addresses", (0, validate_middlewares_1.validate)(user_validator_1.addressSchema), user_controller_1.addAddressController);
// PATCH /api/version1/users/addresses/:addressId — Cập nhật địa chỉ
userRoutesClient.patch("/addresses/:addressId", (0, validate_middlewares_1.validate)(user_validator_1.addressSchema), user_controller_1.updateAddressController);
// DELETE /api/version1/users/addresses/:addressId — Xóa địa chỉ
userRoutesClient.delete("/addresses/:addressId", user_controller_1.deleteAddressController);
// PATCH /api/version1/users/addresses/:addressId/set-default — Đặt làm mặc định
userRoutesClient.patch("/addresses/:addressId/set-default", user_controller_1.setDefaultAddressController);
exports.default = userRoutesClient;
//# sourceMappingURL=user.routes.js.map