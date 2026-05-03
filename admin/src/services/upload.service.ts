import api from "../utils/axios";

export const uploadService = {
  uploadImages: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post(`/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Trả về danh sách URL từ server
    return response.data?.data?.urls || [];
  },
};
