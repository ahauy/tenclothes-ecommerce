export interface IAdminProfile {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "employee";
  avatar?: string;
  phone?: string;
  isActive: boolean;
}

export interface IAdminAuthState {
  accessToken: string;
  isAuthLoading: boolean;
  admin: IAdminProfile | null;
  setAccessToken: (token: string) => void;
  setAdmin: (admin: IAdminProfile | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}
