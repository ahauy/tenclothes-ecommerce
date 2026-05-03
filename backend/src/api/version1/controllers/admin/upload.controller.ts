import { Request, Response } from "express";

export const uploadImagesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cloudinaryUrls = req.body.cloudinaryUrls || [];
    
    res.status(200).json({
      status: true,
      message: "Tải ảnh lên thành công!",
      data: {
        urls: cloudinaryUrls,
      },
    });
  } catch (error) {
    console.error("Lỗi trong uploadImagesController: ", error);
    res.status(500).json({ status: false, message: "Lỗi hệ thống khi tải ảnh!" });
  }
};
