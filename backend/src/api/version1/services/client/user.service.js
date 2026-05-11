"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddressService = exports.deleteAddressService = exports.updateAddressService = exports.addAddressService = exports.getAddressesService = exports.changePasswordService = exports.updateProfileService = exports.getProfileService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
// ---- Get Profile ----
const getProfileService = async (userId) => {
    const user = await user_model_1.default.findById(userId)
        .select("-password -deleted -deletedAt -addresses")
        .lean();
    if (!user) {
        throw new ApiError_1.default(404, "Không tìm thấy thông tin người dùng!");
    }
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? "",
        gender: user.gender ?? "",
        info: {
            dob: user.info?.dob ?? "",
            height: user.info?.height ?? "",
            weight: user.info?.weight ?? "",
        },
    };
};
exports.getProfileService = getProfileService;
// ---- Update Profile ----
const updateProfileService = async (userId, data) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, "Không tìm thấy thông tin người dùng!");
    }
    user.fullName = data.fullName;
    if (data.phone !== undefined)
        user.phone = data.phone;
    if (data.gender)
        user.gender = data.gender;
    if (data.dob !== undefined) {
        user.info = {
            ...user.info,
            dob: data.dob,
        };
    }
    if (data.height !== undefined) {
        user.info = {
            ...user.info,
            height: data.height,
        };
    }
    if (data.weight !== undefined) {
        user.info = {
            ...user.info,
            weight: data.weight,
        };
    }
    await user.save();
    return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? "",
        gender: user.gender ?? "",
        info: {
            dob: user.info?.dob ?? "",
            height: user.info?.height ?? "",
            weight: user.info?.weight ?? "",
        },
    };
};
exports.updateProfileService = updateProfileService;
// ---- Change Password ----
const changePasswordService = async (userId, data) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, "Không tìm thấy thông tin người dùng!");
    }
    const isMatch = await bcrypt_1.default.compare(data.currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError_1.default(400, "Mật khẩu hiện tại không đúng!");
    }
    const hashedNewPassword = await bcrypt_1.default.hash(data.newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
};
exports.changePasswordService = changePasswordService;
// ============================================================
// ---- ADDRESS SERVICES ----
// ============================================================
// GET /users/addresses
const getAddressesService = async (userId) => {
    const user = await user_model_1.default.findById(userId).select("addresses").lean();
    if (!user)
        throw new ApiError_1.default(404, "Không tìm thấy người dùng!");
    return user.addresses ?? [];
};
exports.getAddressesService = getAddressesService;
// POST /users/addresses
const addAddressService = async (userId, data) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new ApiError_1.default(404, "Không tìm thấy người dùng!");
    // Nếu chưa có địa chỉ nào → tự động đặt làm mặc định
    const isFirstAddress = user.addresses.length === 0;
    // Mongoose tự khởi tạo DocumentArray, không cần fallback []
    user.addresses.push({
        name: data.name,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        address: data.address,
        isDefault: isFirstAddress,
    });
    await user.save();
    return user.addresses;
};
exports.addAddressService = addAddressService;
// PATCH /users/addresses/:addressId
const updateAddressService = async (userId, addressId, data) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new ApiError_1.default(404, "Không tìm thấy người dùng!");
    const addressDoc = user.addresses?.id(addressId);
    if (!addressDoc)
        throw new ApiError_1.default(404, "Không tìm thấy địa chỉ!");
    addressDoc.name = data.name;
    addressDoc.phone = data.phone;
    addressDoc.province = data.province;
    addressDoc.district = data.district;
    addressDoc.ward = data.ward;
    addressDoc.address = data.address;
    await user.save();
    return user.addresses;
};
exports.updateAddressService = updateAddressService;
// DELETE /users/addresses/:addressId
const deleteAddressService = async (userId, addressId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new ApiError_1.default(404, "Không tìm thấy người dùng!");
    const addressDoc = user.addresses?.id(addressId);
    if (!addressDoc)
        throw new ApiError_1.default(404, "Không tìm thấy địa chỉ!");
    if (addressDoc.isDefault) {
        throw new ApiError_1.default(400, "Không thể xóa địa chỉ mặc định! Vui lòng đặt địa chỉ khác làm mặc định trước.");
    }
    addressDoc.deleteOne();
    await user.save();
    return user.addresses;
};
exports.deleteAddressService = deleteAddressService;
// PATCH /users/addresses/:addressId/set-default
const setDefaultAddressService = async (userId, addressId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new ApiError_1.default(404, "Không tìm thấy người dùng!");
    const targetAddress = user.addresses?.id(addressId);
    if (!targetAddress)
        throw new ApiError_1.default(404, "Không tìm thấy địa chỉ!");
    // Reset tất cả về false, sau đó set target thành true
    user.addresses?.forEach((addr) => {
        addr.isDefault = String(addr._id) === String(addressId);
    });
    await user.save();
    return user.addresses;
};
exports.setDefaultAddressService = setDefaultAddressService;
//# sourceMappingURL=user.service.js.map