export interface IUserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  info: {
    dob: string;
    height: string;
    weight: string;
  };
}

export interface IAuthState {
  accessToken: string;
  isAuthLoading: boolean;
  user: IUserProfile | null;
  setAccessToken: (token: string) => void;
  setUser: (user: IUserProfile | null) => void;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

export interface IJsonFail {
  status: false;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}