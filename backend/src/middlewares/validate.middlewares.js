"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
// import { AnyZodObject } from "zod/v3"; // để đảm bảo parseAsync sau khi kiểm tra xong sẽ trả về 1 object có chúa các trường có trong data: body, query, params
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // kiểm tra dữ liệu
            const parsedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // // gán dữ liệu chuyển đổi vào trong req
            if (parsedData["body"])
                req.body = parsedData["body"];
            if (parsedData["query"])
                req.query = parsedData["body"];
            if (parsedData["params"])
                req.params = parsedData["params"];
            next();
        }
        catch (error) {
            // Nếu có lỗi, trả về 400 ngay lập tức
            if (error instanceof zod_1.ZodError) {
                // Biến mảng lỗi rắc rối của Zod thành mảng JSON đẹp mắt cho Frontend
                const formattedErrors = error.issues.map((issue) => ({
                    field: issue.path[issue.path.length - 1], // Lấy tên trường bị lỗi (vd: price)
                    message: issue.message, // Lấy câu thông báo tiếng Việt
                }));
                res.status(400).json({
                    status: false,
                    message: "Dữ liệu không hợp lệ!",
                    errors: formattedErrors,
                    data: null
                });
                return;
            }
            res.status(500).json({
                status: false,
                message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
                data: null,
            });
            return;
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middlewares.js.map