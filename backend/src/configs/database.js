"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// LvW6DWEQ4goRp4cG
// e-commerce_db_user
// mongodb+srv://e-commerce_db_user:LvW6DWEQ4goRp4cG@cluster0.nfyidlt.mongodb.net/?appName=Cluster0
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env["MONGODB_URL"]);
        console.log("Liên kết CSDL thành công!");
    }
    catch (error) {
        console.error("Liên kết cơ sở dữ liệu thất bại: ", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map