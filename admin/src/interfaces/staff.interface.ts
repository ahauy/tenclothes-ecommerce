export interface IStaffAdmin {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: "admin" | "employee";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
