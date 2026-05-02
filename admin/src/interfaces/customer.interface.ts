export interface ICustomerAddress {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault: boolean;
}

export interface ICustomerAdmin {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  isActive: boolean;
  addresses?: ICustomerAddress[];
  createdAt: string;
  updatedAt: string;
}
