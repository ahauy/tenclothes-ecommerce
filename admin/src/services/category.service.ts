import api from "../utils/axios";

export const categoryService = {
  getCategories: async () => {
    const response = await api.get(`/category`);
    return response.data;
  },
};
