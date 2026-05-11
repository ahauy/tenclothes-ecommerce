"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productLog_model_1 = __importDefault(require("../models/productLog.model"));
// Helper ghi log
const writeProductLog = async (productId, action, staff, changes) => {
    const logData = {
        productId,
        action,
        performedBy: staff._id,
        actorInfo: {
            fullName: (staff.fullName || (staff.email ? staff.email.split("@")[0] : "Unknown")),
            role: (staff.role || "Unknown"),
            email: (staff.email || "unknown@example.com"),
        },
    };
    if (changes) {
        logData["changes"] = changes;
    }
    await productLog_model_1.default.create(logData);
};
exports.default = writeProductLog;
//# sourceMappingURL=writeProductLog.js.map