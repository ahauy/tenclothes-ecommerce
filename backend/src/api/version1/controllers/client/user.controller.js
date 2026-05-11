"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddressController = exports.deleteAddressController = exports.updateAddressController = exports.addAddressController = exports.getAddressesController = exports.changePasswordController = exports.updateProfileController = exports.getProfileController = void 0;
const user_service_1 = require("../../services/client/user.service");
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
// ---- GET /users/profile ----
const getProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const profile = await (0, user_service_1.getProfileService)(userId);
        res.status(200).json({
            status: true,
            message: "Lấy thông tin hồ sơ thành công!",
            data: profile,
        });
    }
    catch (error) {
        console.error("Lỗi trong getProfileController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getProfileController = getProfileController;
// ---- PATCH /users/profile ----
const updateProfileController = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedProfile = await (0, user_service_1.updateProfileService)(userId, req.body);
        res.status(200).json({
            status: true,
            message: "Cập nhật thông tin thành công!",
            data: updatedProfile,
        });
    }
    catch (error) {
        console.error("Lỗi trong updateProfileController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.updateProfileController = updateProfileController;
// ---- PATCH /users/change-password ----
const changePasswordController = async (req, res) => {
    try {
        const userId = req.user._id;
        await (0, user_service_1.changePasswordService)(userId, req.body);
        res.status(200).json({
            status: true,
            message: "Đổi mật khẩu thành công!",
        });
    }
    catch (error) {
        console.error("Lỗi trong changePasswordController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.changePasswordController = changePasswordController;
// ============================================================
// ---- ADDRESS CONTROLLERS ----
// ============================================================
// GET /users/addresses
const getAddressesController = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await (0, user_service_1.getAddressesService)(userId);
        res.status(200).json({ status: true, message: "Lấy danh sách địa chỉ thành công!", data: addresses });
    }
    catch (error) {
        console.error("Lỗi trong getAddressesController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.getAddressesController = getAddressesController;
// POST /users/addresses
const addAddressController = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await (0, user_service_1.addAddressService)(userId, req.body);
        res.status(201).json({ status: true, message: "Thêm địa chỉ thành công!", data: addresses });
    }
    catch (error) {
        console.error("Lỗi trong addAddressController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.addAddressController = addAddressController;
// PATCH /users/addresses/:addressId
const updateAddressController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const addresses = await (0, user_service_1.updateAddressService)(userId, addressId, req.body);
        res.status(200).json({ status: true, message: "Cập nhật địa chỉ thành công!", data: addresses });
    }
    catch (error) {
        console.error("Lỗi trong updateAddressController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.updateAddressController = updateAddressController;
// DELETE /users/addresses/:addressId
const deleteAddressController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const addresses = await (0, user_service_1.deleteAddressService)(userId, addressId);
        res.status(200).json({ status: true, message: "Xóa địa chỉ thành công!", data: addresses });
    }
    catch (error) {
        console.error("Lỗi trong deleteAddressController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.deleteAddressController = deleteAddressController;
// PATCH /users/addresses/:addressId/set-default
const setDefaultAddressController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const addresses = await (0, user_service_1.setDefaultAddressService)(userId, addressId);
        res.status(200).json({ status: true, message: "Đã đặt làm địa chỉ mặc định!", data: addresses });
    }
    catch (error) {
        console.error("Lỗi trong setDefaultAddressController:", error);
        if (error instanceof ApiError_1.default) {
            res.status(error.statusCode).json({ status: false, message: error.message });
            return;
        }
        res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
    }
};
exports.setDefaultAddressController = setDefaultAddressController;
//# sourceMappingURL=user.controller.js.map