import User from "../../../../models/user.model";
import ApiError from "../../../../helpers/ApiError";
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface";

// 1. Get all users with pagination, filter, and search
export const getListOrderAdminService = async (queryFilter: IRequestQueryFilter) => {
  const {
    page = "1",
    limit = "10",
    keyword,
  } = queryFilter;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter: any = { deleted: false };

  if (keyword) {
    filter.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 })
    .lean();

  const total = await User.countDocuments(filter);

  return {
    users,
    total,
    page: pageNum,
    limit: limitNum,
  };
};

// 2. Get user by ID
export const getUserByIdAdminService = async (userId: string) => {
  const user = await User.findOne({
    _id: userId,
    deleted: false,
  })
    .select("-password")
    .lean();

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  return user;
};

// 3. Update user status (isActive)
export const updateUserStatusAdminService = async (userId: string, isActive: boolean) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, deleted: false },
    { isActive },
    { new: true }
  )
    .select("-password")
    .lean();

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  return user;
};

// 4. Soft delete user
export const softDeleteUserAdminService = async (userId: string) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, deleted: false },
    { deleted: true, deletedAt: new Date(), isActive: false },
    { new: true }
  ).lean();

  if (!user) {
    throw new ApiError(404, "Không tìm thấy người dùng");
  }

  return true;
};
