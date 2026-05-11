"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagesController = void 0;
const uploadImagesController = async (req, res) => {
    try {
        const cloudinaryUrls = req.body.cloudinaryUrls || [];
        res.status(200).json({
            status: true,
            message: "Tải ảnh lên thành công!",
            data: {
                urls: cloudinaryUrls,
            },
        });
    }
    catch (error) {
        console.error("Lỗi trong uploadImagesController: ", error);
        res.status(500).json({ status: false, message: "Lỗi hệ thống khi tải ảnh!" });
    }
};
exports.uploadImagesController = uploadImagesController;
//# sourceMappingURL=upload.controller.js.map