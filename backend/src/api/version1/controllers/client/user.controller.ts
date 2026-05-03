import { Response } from "express";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import {
  getProfileService,
  updateProfileService,
  changePasswordService,
  getAddressesService,
  addAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from "../../services/client/user.service";
import {
  IUpdateProfileBody,
  IChangePasswordBody,
  IAddressBody,
} from "../../validators/client/user.validator";
import ApiError from "../../../../helpers/ApiError";


// ---- GET /users/profile ----
export const getProfileController = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const profile = await getProfileService(userId);

    res.status(200).json({
      status: true,
      message: "Lấy thông tin hồ sơ thành công!",
      data: profile,
    });
  } catch (error) {
    console.error("Lỗi trong getProfileController:", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// ---- PATCH /users/profile ----
export const updateProfileController = async (
  req: IAuthRequest & { body: IUpdateProfileBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const updatedProfile = await updateProfileService(userId, req.body);

    res.status(200).json({
      status: true,
      message: "Cập nhật thông tin thành công!",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Lỗi trong updateProfileController:", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// ---- PATCH /users/change-password ----
export const changePasswordController = async (
  req: IAuthRequest & { body: IChangePasswordBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    await changePasswordService(userId, req.body);

    res.status(200).json({
      status: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Lỗi trong changePasswordController:", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// ============================================================
// ---- ADDRESS CONTROLLERS ----
// ============================================================

// GET /users/addresses
export const getAddressesController = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const addresses = await getAddressesService(userId);
    res.status(200).json({ status: true, message: "Lấy danh sách địa chỉ thành công!", data: addresses });
  } catch (error) {
    console.error("Lỗi trong getAddressesController:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// POST /users/addresses
export const addAddressController = async (
  req: IAuthRequest & { body: IAddressBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const addresses = await addAddressService(userId, req.body);
    res.status(201).json({ status: true, message: "Thêm địa chỉ thành công!", data: addresses });
  } catch (error) {
    console.error("Lỗi trong addAddressController:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// PATCH /users/addresses/:addressId
export const updateAddressController = async (
  req: IAuthRequest & { body: IAddressBody },
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { addressId } = req.params as { addressId: string };
    const addresses = await updateAddressService(userId, addressId, req.body);
    res.status(200).json({ status: true, message: "Cập nhật địa chỉ thành công!", data: addresses });
  } catch (error) {
    console.error("Lỗi trong updateAddressController:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// DELETE /users/addresses/:addressId
export const deleteAddressController = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { addressId } = req.params as { addressId: string };
    const addresses = await deleteAddressService(userId, addressId);
    res.status(200).json({ status: true, message: "Xóa địa chỉ thành công!", data: addresses });
  } catch (error) {
    console.error("Lỗi trong deleteAddressController:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};

// PATCH /users/addresses/:addressId/set-default
export const setDefaultAddressController = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { addressId } = req.params as { addressId: string };
    const addresses = await setDefaultAddressService(userId, addressId);
    res.status(200).json({ status: true, message: "Đã đặt làm địa chỉ mặc định!", data: addresses });
  } catch (error) {
    console.error("Lỗi trong setDefaultAddressController:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ status: false, message: error.message });
      return;
    }
    res.status(500).json({ status: false, message: "Lỗi hệ thống!" });
  }
};
