"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
cloudinary_1.v2.config({
    cloud_name: process.env["CLOUDINARY_NAME"],
    api_key: process.env["CLOUDINARY_API_KEY"],
    api_secret: process.env["CLOUDINARY_SECRET"],
});
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = async (req, _res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return next();
        }
        const cloudinaryUrls = [];
        for (const file of files) {
            // 1. Khởi tạo một biến chứa bộ nhớ tạm gốc ban đầu
            let finalBuffer = file.buffer;
            // 2. CHỈ dùng sharp để resize nếu KHÔNG PHẢI là ảnh từ iPhone (HEIC/HEIF)
            if (file.mimetype !== "image/heic" && file.mimetype !== "image/heif") {
                finalBuffer = await (0, sharp_1.default)(file.buffer)
                    .resize({ width: 800, height: 600 })
                    .toBuffer();
            }
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                folder: "e-commerce",
            }, (err, result) => {
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
            });
            uploadStream.end(finalBuffer);
        }
    }
    catch (error) {
        console.error("Error in uploadToCloudinary middleware:", error);
        next(error);
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=uploadToCloudinary.js.map