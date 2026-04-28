import bcrypt from "bcrypt";
import User from "../../../../models/user.model";
import ApiError from "../../../../helpers/ApiError";
import { IUpdateProfileBody, IChangePasswordBody, IAddressBody } from "../../validators/client/user.validator";


// ---- Get Profile ----
export const getProfileService = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password -deleted -deletedAt -addresses")
    .lean();

  if (!user) {
    throw new ApiError(404, "Không tìm thấy thông tin người dùng!");
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

// ---- Update Profile ----
export const updateProfileService = async (
  userId: string,
  data: IUpdateProfileBody
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Không tìm thấy thông tin người dùng!");
  }

  user.fullName = data.fullName;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.gender) user.gender = data.gender;
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

// ---- Change Password ----
export const changePasswordService = async (
  userId: string,
  data: IChangePasswordBody
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Không tìm thấy thông tin người dùng!");
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Mật khẩu hiện tại không đúng!");
  }

  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();
};

// ============================================================
// ---- ADDRESS SERVICES ----
// ============================================================

// GET /users/addresses
export const getAddressesService = async (userId: string) => {
  const user = await User.findById(userId).select("addresses").lean();
  if (!user) throw new ApiError(404, "Không tìm thấy người dùng!");
  return user.addresses ?? [];
};

// POST /users/addresses
export const addAddressService = async (userId: string, data: IAddressBody) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Không tìm thấy người dùng!");

  // Nếu chưa có địa chỉ nào → tự động đặt làm mặc định
  const isFirstAddress = user.addresses!.length === 0;

  // Mongoose tự khởi tạo DocumentArray, không cần fallback []
  user.addresses!.push({
    name: data.name,
    phone: data.phone,
    province: data.province,
    district: data.district,
    ward: data.ward,
    address: data.address,
    isDefault: isFirstAddress,
  } as any);

  await user.save();
  return user.addresses;
};

// PATCH /users/addresses/:addressId
export const updateAddressService = async (
  userId: string,
  addressId: string,
  data: IAddressBody
) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Không tìm thấy người dùng!");

  const addressDoc = user.addresses?.id(addressId);
  if (!addressDoc) throw new ApiError(404, "Không tìm thấy địa chỉ!");

  addressDoc.name = data.name;
  addressDoc.phone = data.phone;
  addressDoc.province = data.province;
  addressDoc.district = data.district;
  addressDoc.ward = data.ward;
  addressDoc.address = data.address;

  await user.save();
  return user.addresses;
};

// DELETE /users/addresses/:addressId
export const deleteAddressService = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Không tìm thấy người dùng!");

  const addressDoc = user.addresses?.id(addressId);
  if (!addressDoc) throw new ApiError(404, "Không tìm thấy địa chỉ!");

  if (addressDoc.isDefault) {
    throw new ApiError(400, "Không thể xóa địa chỉ mặc định! Vui lòng đặt địa chỉ khác làm mặc định trước.");
  }

  addressDoc.deleteOne();
  await user.save();
  return user.addresses;
};

// PATCH /users/addresses/:addressId/set-default
export const setDefaultAddressService = async (userId: string, addressId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Không tìm thấy người dùng!");

  const targetAddress = user.addresses?.id(addressId);
  if (!targetAddress) throw new ApiError(404, "Không tìm thấy địa chỉ!");

  // Reset tất cả về false, sau đó set target thành true
  user.addresses?.forEach((addr: any) => {
    addr.isDefault = String(addr._id) === String(addressId);
  });

  await user.save();
  return user.addresses;
};
