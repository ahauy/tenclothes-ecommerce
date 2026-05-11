"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutShareController = exports.refreshShareController = exports.loginShareController = void 0;
const auth_sharedServices_1 = require("../../services/shared/auth.sharedServices");
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const loginShareController = (DataModel) => {
    return async (req, res) => {
        try {
            const loginData = req.body;
            const data = await (0, auth_sharedServices_1.loginShareService)(DataModel, loginData);
            if (data) {
                res.cookie("jwt", data.refreshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    status: true,
                    message: "Đăng nhập thành công!",
                    accessToken: data.accessToken,
                    data: data.user,
                });
                return;
            }
        }
        catch (error) {
            console.error("Có lỗi trong loginController: ", error);
            // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
            if (error instanceof ApiError_1.default) {
                res.status(error.statusCode).json({
                    status: false,
                    message: error.message, // Sẽ in ra "Email đã được sử dụng!"
                });
                return;
            }
            // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
            res.status(500).json({ message: "Lỗi hệ thống!" });
        }
    };
};
exports.loginShareController = loginShareController;
const refreshShareController = () => {
    return async (req, res) => {
        try {
            const refreshToken = req.cookies["jwt"];
            if (!refreshToken) {
                res.status(401).json({
                    message: "Không tìm thấy quyền truy cập. Vui lòng đăng nhập lại!",
                });
                return;
            }
            const newAccessToken = (0, auth_sharedServices_1.verifyRefreshTokenShareService)(refreshToken);
            res.status(200).json({
                message: "Tạo mới accessToken thành công!",
                accessToken: newAccessToken,
            });
        }
        catch (error) {
            console.error("Có lỗi trong refreshController: ", error);
            // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
            if (error instanceof ApiError_1.default) {
                res.status(error.statusCode).json({
                    status: false,
                    message: error.message,
                });
                return;
            }
            // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
            res.status(500).json({ message: "Lỗi hệ thống!" });
        }
    };
};
exports.refreshShareController = refreshShareController;
const logoutShareController = () => {
    return (_req, res) => {
        try {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
            });
            res.status(200).json({ message: "Đăng xuất thành công!" });
        }
        catch (error) {
            console.log("Có lỗi trong loginController: ", error);
            res.status(500).json({ message: "Lỗi hệ thống!" });
        }
    };
};
exports.logoutShareController = logoutShareController;
//# sourceMappingURL=auth.shareController.js.map