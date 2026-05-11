"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
const Account = mongoose_1.default.model("Account", accountSchema, "accounts");
exports.default = Account;
//# sourceMappingURL=account.model.js.map