"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = void 0;
// import jwt from "jsonwebtoken";
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { IDecodeToken } from "../../../../interfaces/auth.interfaces";
const ApiError_1 = __importDefault(require("../../../../helpers/ApiError"));
const registerService = async (registerData) => {
    const existingUser = await user_model_1.default.findOne({ email: registerData.email });
    if (existingUser) {
        throw new ApiError_1.default(409, "Email đã được sử dụng!");
    }
    const hashPassword = await bcrypt_1.default.hash(registerData.password, 10);
    const newUser = await user_model_1.default.create({
        fullName: registerData.fullName,
        email: registerData.email,
        password: hashPassword,
    });
    return {
        _id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
    };
};
exports.registerService = registerService;
// export const verifyRefreshTokenService = (refreshToken: string): (string | Error) => {
//   try {
//     const decode = jwt.verify(refreshToken, process.env["REFRESH_TOKEN_SECRET"]!) as IDecodeToken
//     const newAccessToken = jwt.sign(
//       {
//         _id: decode._id,
//         email: decode.email,
//       },
//       process.env["ACCESS_TOKEN_SECRET"]!,
//       { expiresIn: "10m" }
//     );
//     return newAccessToken;
//   } catch (error) {
//     throw new ApiError(403, "Xác thực refreshToken thất bại!")
//   }
// }
//# sourceMappingURL=auth.service.js.map