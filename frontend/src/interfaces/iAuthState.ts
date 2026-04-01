export interface IAuthState {
  accessToken: string;
  isAuthLoading: boolean;
  setAccessToken: (token: string) => void;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

export interface IJsonFail {
  status: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}