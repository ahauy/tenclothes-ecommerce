import api from "../utils/axios";

export interface IUpdateProfilePayload {
  fullName: string;
  phone?: string;
  gender?: "male" | "female" | "other" | "";
  dob?: string;
  height?: string;
  weight?: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAddressPayload {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

export interface IAddress extends IAddressPayload {
  _id: string;
  isDefault: boolean;
}

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const userServices = {
  getProfile: (accessToken: string) => {
    return api.get("/users/profile", { headers: authHeaders(accessToken) });
  },

  updateProfile: (accessToken: string, data: IUpdateProfilePayload) => {
    return api.patch("/users/profile", data, { headers: authHeaders(accessToken) });
  },

  changePassword: (accessToken: string, data: IChangePasswordPayload) => {
    return api.patch("/users/change-password", data, { headers: authHeaders(accessToken) });
  },

  // ---- Address APIs ----
  getAddresses: (accessToken: string) => {
    return api.get("/users/addresses", { headers: authHeaders(accessToken) });
  },

  addAddress: (accessToken: string, data: IAddressPayload) => {
    return api.post("/users/addresses", data, { headers: authHeaders(accessToken) });
  },

  updateAddress: (accessToken: string, addressId: string, data: IAddressPayload) => {
    return api.patch(`/users/addresses/${addressId}`, data, { headers: authHeaders(accessToken) });
  },

  deleteAddress: (accessToken: string, addressId: string) => {
    return api.delete(`/users/addresses/${addressId}`, { headers: authHeaders(accessToken) });
  },

  setDefaultAddress: (accessToken: string, addressId: string) => {
    return api.patch(`/users/addresses/${addressId}/set-default`, {}, { headers: authHeaders(accessToken) });
  },
};
