import api from "../utils/axios";

export const productService = {
  getProducts: async (params?: Record<string, string | number | boolean | undefined>) => {
    const response = await api.get(`/products`, { params });
    return response.data;
  },

  getProductsBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  createProduct: async (data: Record<string, unknown> | FormData) => {
    const response = await api.post(`/products/create`, data);
    return response.data;
  },

  updateProduct: async (slug: string, data: Record<string, unknown> | FormData) => {
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

  restoreProduct: async (slug: string) => {
    const response = await api.patch(`/products/restore/${slug}`);
    return response.data;
  },

  getProductHistory: async (slug: string) => {
    const response = await api.get(`/products/history/${slug}`);
    return response.data;
  },

  // Batch Operations
  batchDelete: async (slugs: string[]) => {
    const response = await api.post(`/products/batch/delete`, { slugs });
    return response.data;
  },

  batchChangeStatus: async (slugs: string[], status: boolean) => {
    const response = await api.patch(`/products/batch/change-status`, { slugs, status });
    return response.data;
  },

  batchChangeFeatured: async (slugs: string[], isFeatured: boolean) => {
    const response = await api.patch(`/products/batch/change-featured`, { slugs, isFeatured });
    return response.data;
  },
};
