import multer, { Multer } from "multer";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

cloudinary.config({
  cloud_name: process.env["CLOUDINARY_NAME"]!,
  api_key: process.env["CLOUDINARY_API_KEY"]!,
  api_secret: process.env["CLOUDINARY_SECRET"]!,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

const storage = multer.memoryStorage();

export const upload: Multer = multer({ storage: storage });

export const uploadToCloudinary = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const files: CloudinaryFile[] = req.files as CloudinaryFile[];
    if (!files || files.length === 0) {
      return next();
    }
    const cloudinaryUrls: string[] = [];
    for (const file of files) {
      // 1. Khởi tạo một biến chứa bộ nhớ tạm gốc ban đầu
      let finalBuffer: Buffer = file.buffer;

      // 2. CHỈ dùng sharp để resize nếu KHÔNG PHẢI là ảnh từ iPhone (HEIC/HEIF)
      if (file.mimetype !== "image/heic" && file.mimetype !== "image/heif") {
        finalBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 600 })
          .toBuffer();
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "e-commerce",
        } as any,
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return next(err);
          }
          if (!result) {
            console.error("Cloudinary upload error: Result is undefined");
            return next(new Error("Cloudinary upload result is undefined"));
          }
          cloudinaryUrls.push(result.secure_url);

          if (cloudinaryUrls.length === files.length) {
            //All files processed now get your images here
            req.body.cloudinaryUrls = cloudinaryUrls;
            next();
          }
        }
      );
      uploadStream.end(finalBuffer);
    }
  } catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    next(error);
  }
};
