import Account from "../../../../models/account.model";
import ApiError from "../../../../helpers/ApiError";
import bcrypt from "bcrypt";

interface IStaffQuery {
  page?: string;
  limit?: string;
  keyword?: string;
}

interface ICreateStaffInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: "admin" | "employee";
  isActive?: boolean;
}

interface IUpdateStaffInput {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role?: "admin" | "employee";
  isActive?: boolean;
}

// 1. Get List Staffs
export const getListStaffsService = async (queryFilter: IStaffQuery) => {
  const { page = "1", limit = "10", keyword } = queryFilter;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = { deleted: false };

  if (keyword) {
    filter["$or"] = [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ];
  }

  const staffs = await Account.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Account.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum);

  return {
    staffs,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  };
};

// 2. Create Staff Account
export const createStaffService = async (input: ICreateStaffInput) => {
  const existingAccount = await Account.findOne({ email: input.email, deleted: false }).lean();
  if (existingAccount) {
    throw new ApiError(400, "Email đã được sử dụng bởi một nhân viên khác");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const newStaff = new Account({
    ...input,
    password: hashedPassword,
  });

  await newStaff.save();

  // Convert to lean object and delete password
  const staffObj = newStaff.toObject();
  delete (staffObj as { password?: string }).password;

  return staffObj;
};

// 3. Update Staff Account
export const updateStaffService = async (id: string, input: IUpdateStaffInput) => {
  const staff = await Account.findOne({ _id: id, deleted: false });
  if (!staff) {
    throw new ApiError(404, "Không tìm thấy tài khoản nhân viên");
  }

  if (input.email && input.email !== staff.email) {
    const existingEmail = await Account.findOne({ email: input.email, deleted: false }).lean();
    if (existingEmail) {
      throw new ApiError(400, "Email đã được sử dụng bởi một nhân viên khác");
    }
  }

  const updateData: Record<string, unknown> = { ...input };

  if (input.password) {
    updateData["password"] = await bcrypt.hash(input.password, 10);
  }

  const updatedStaff = await Account.findOneAndUpdate(
    { _id: id, deleted: false },
    updateData,
    { new: true }
  )
    .select("-password")
    .lean();

  return updatedStaff;
};

// 4. Soft Delete Staff
export const softDeleteStaffService = async (id: string) => {
  const staff = await Account.findOneAndUpdate(
    { _id: id, deleted: false },
    { deleted: true, isActive: false }
  ).lean();

  if (!staff) {
    throw new ApiError(404, "Không tìm thấy tài khoản nhân viên");
  }

  return true;
};
