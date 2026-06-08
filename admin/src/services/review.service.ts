import api from "../utils/axios";

export const reviewService = {
  getReviews: async (params?: Record<string, string | number | boolean | undefined>) => {
    const response = await api.get(`/reviews`, { params });
    return response.data;
  },

  approveReview: async (id: string) => {
    const response = await api.patch(`/reviews/approve/${id}`);
    return response.data;
  },

  rejectReview: async (id: string) => {
    const response = await api.patch(`/reviews/reject/${id}`);
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
