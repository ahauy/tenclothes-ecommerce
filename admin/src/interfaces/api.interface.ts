export interface ApiErrorResponse {
  status: boolean;
  message: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiErrorResponse | IJsonFail;
  };
  message: string;
}

export interface IJsonFail {
  status: false;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}