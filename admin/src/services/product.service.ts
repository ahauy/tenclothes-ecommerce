import api from "../utils/axios";

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get(`/products`, { params });
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post(`/products/create`, data);
    return response.data;
  },

  updateProduct: async (slug: string, data: any) => {
    const response = await api.patch(`/products/update/${slug}`, data);
    return response.data;
  },

  changeStatus: async (slug: string, status: boolean) => {
    const response = await api.patch(`/products/change-status/${slug}`, { status });
    return response.data;
  },

  changeFeatured: async (slug: string, isFeatured: boolean) => {
    const response = await api.patch(`/products/change-featured/${slug}`, { isFeatured });
    return response.data;
  },

  deleteProduct: async (slug: string) => {
    const response = await api.delete(`/products/delete/${slug}`);
    return response.data;
  },
};
