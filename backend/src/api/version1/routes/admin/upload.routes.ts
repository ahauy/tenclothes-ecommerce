import express, { Router } from "express";
import * as controller from "../../controllers/admin/upload.controller";
import { verifyToken } from "../../../../middlewares/authen.middlewares";
import { authorizationRole } from "../../../../middlewares/authorize.middlewares";
import { upload, uploadToCloudinary } from "../../../../helpers/uploadToCloudinary";

const uploadRouter: Router = express.Router();

uploadRouter.post(
  "/",
  verifyToken,
  authorizationRole(["admin"]),
  upload.array("images", 50), // Cho phép tối đa 50 ảnh (để dư dả cho 10 màu x 5 ảnh)
  uploadToCloudinary,
  controller.uploadImagesController
);

export default uploadRouter;
