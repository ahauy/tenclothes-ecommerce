"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const randomCode = (length) => {
    const randomStr = crypto_1.default
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .toUpperCase()
        .slice(0, length);
    return randomStr;
};
exports.randomCode = randomCode;
//# sourceMappingURL=randomCode.js.map