"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    info: {
        height: String,
        weight: String,
        dob: String,
    },
    addresses: [
        {
            name: { type: String }, // Tên người nhận hàng
            phone: { type: String }, // SĐT nhận hàng
            province: {
                type: String,
            }, // Tỉnh/Thành
            district: {
                type: String,
            }, // Quận/Huyện
            ward: {
                type: String,
            }, // Phường/Xã
            address: { type: String }, // Số nhà, đường...
            isDefault: {
                type: Boolean,
                default: false,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema, "users");
exports.default = User;
//# sourceMappingURL=user.model.js.map