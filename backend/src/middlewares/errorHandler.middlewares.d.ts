import { Request, Response, NextFunction } from "express";
interface AppError extends Error {
    status?: number;
    type?: string;
    code?: string;
}
/**
 * Global Error Handler Middleware
 * Bắt mọi lỗi không được xử lý trong pipeline của Express,
 * bao gồm cả lỗi "request aborted" từ raw-body/body-parser.
 */
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=errorHandler.middlewares.d.ts.map