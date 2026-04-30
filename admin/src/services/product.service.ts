import api from "../utils/axios";

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get(`/products`, { params });
    return response.data;
  },

  createProduct: async (formData: FormData) => {
    const response = await api.post(`/product/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
