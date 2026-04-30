import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cookieparser from 'cookie-parser';
import cors from "cors";
import mainV1RoutesClient from "./api/version1/routes/client/index.routes";
import mainV1RoutesAdmin from "./api/version1/routes/admin/index.routes";

const app = express()

// middleware parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Lấy URL frontend từ biến môi trường (ví dụ: https://tenclothes-frontend.vercel.app)
const FRONTEND_URL = process.env["FRONTEND_URL"] || "http://localhost:5173";
const FRONTEND_URL_ADMIN = process.env["FRONTEND_URL_ADMIN"] || "http://localhost:5174";

// Cấu hình cors linh hoạt
app.use(cors({ 
  origin: [FRONTEND_URL, FRONTEND_URL_ADMIN, "http://localhost:5173", "http://localhost:5174"], // Cho phép cả URL frontend và localhost
  credentials: true 
}));

// routes api in version1
mainV1RoutesClient(app)
mainV1RoutesAdmin(app)

export default app;