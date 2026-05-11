"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshTokenShareService = exports.loginShareService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const loginShareService = async (DataModal, dataLogin) => {
    const { email, password } = dataLogin;
    const userByEmail = await DataModal.findOne({ email: email, deleted: false });
    // kiểm tra các điều kiện đăng nhập
    if (userByEmail) {
        if (await bcrypt_1.default.compare(password, userByEmail.password)) {
            const accessToken = jsonwebtoken_1.default.sign({
                _id: userByEmail.id,
                email: userByEmail.email,
                fullName: userByEmail.fullName,
                ...(userByEmail.role && { role: userByEmail.role })
            }, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: "10m" });
            const refreshToken = jsonwebtoken_1.default.sign({
                _id: userByEmail.id,
                email: userByEmail.email,
                fullName: userByEmail.fullName,
                ...(userByEmail.role && { role: userByEmail.role })
            }, process.env["REFRESH_TOKEN_SECRET"], { expiresIn: "1d" });
            const { password, ...userWithoutPassword } = userByEmail.toObject();
            return { accessToken, refreshToken, user: userWithoutPassword };
        }
    }
    throw new ApiError_1.default(406, "Thông tin đăng nhập không hợp lệ");
};
exports.loginShareService = loginShareService;
const verifyRefreshTokenShareService = (refreshToken) => {
    try {
        const decode = jsonwebtoken_1.default.verify(refreshToken, process.env["REFRESH_TOKEN_SECRET"]);
        const newAccessToken = jsonwebtoken_1.default.sign({
            _id: decode._id,
            email: decode.email,
            fullName: decode["fullName"],
            ...(decode.role && { role: decode.role })
        }, process.env["ACCESS_TOKEN_SECRET"], { expiresIn: "10m" });
        return newAccessToken;
    }
    catch (error) {
        throw new ApiError_1.default(403, "Xác thực refreshToken thất bại!");
    }
};
exports.verifyRefreshTokenShareService = verifyRefreshTokenShareService;
//# sourceMappingURL=auth.sharedServices.js.map