import api from "../utils/axios";
import { useAuthStore } from "../stores/useAuthStore";

export const reviewService = {
  createReviewService: async (
    productId: string,
    orderId: string,
    rating: number,
    content: string,
    images: File[] = []
  ) => {
    const token = useAuthStore.getState().accessToken;
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("orderId", orderId);
    formData.append("rating", rating.toString());
    formData.append("content", content);

    images.forEach((file) => {
      formData.append("images", file);
    });

    return await api.post("/reviews", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  getReviewsByProduct: async (productId: string) => {
    return await api.get(`/reviews/${productId}`);
  }
};
