import express, { Router } from "express";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { validate } from "../../../../middlewares/validate.middlewares";
import {
  getProfileController,
  updateProfileController,
  changePasswordController,
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "../../controllers/client/user.controller";
import {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
} from "../../validators/client/user.validator";

const userRoutesClient: Router = express.Router();

// Tất cả routes đều yêu cầu xác thực
userRoutesClient.use(verifyToken);

// ---- Profile ----
// GET /api/version1/users/profile — Lấy thông tin hồ sơ
userRoutesClient.get("/profile", getProfileController);

// PATCH /api/version1/users/profile — Cập nhật thông tin cá nhân
userRoutesClient.patch("/profile", validate(updateProfileSchema), updateProfileController);

// PATCH /api/version1/users/change-password — Đổi mật khẩu
userRoutesClient.patch("/change-password", validate(changePasswordSchema), changePasswordController);

// ---- Addresses ----
// GET /api/version1/users/addresses — Lấy danh sách địa chỉ
userRoutesClient.get("/addresses", getAddressesController);

// POST /api/version1/users/addresses — Thêm địa chỉ mới
userRoutesClient.post("/addresses", validate(addressSchema), addAddressController);

// PATCH /api/version1/users/addresses/:addressId — Cập nhật địa chỉ
userRoutesClient.patch("/addresses/:addressId", validate(addressSchema), updateAddressController);

// DELETE /api/version1/users/addresses/:addressId — Xóa địa chỉ
userRoutesClient.delete("/addresses/:addressId", deleteAddressController);

// PATCH /api/version1/users/addresses/:addressId/set-default — Đặt làm mặc định
userRoutesClient.patch("/addresses/:addressId/set-default", setDefaultAddressController);

export default userRoutesClient;
