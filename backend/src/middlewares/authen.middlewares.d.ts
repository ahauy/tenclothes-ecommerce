import { Request, Response, NextFunction } from "express";
export interface IAuthRequest extends Request {
    user?: {
        _id: string;
        email?: string;
        role?: string;
        fullName?: string;
    };
}
export declare const verifyToken: (req: IAuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authen.middlewares.d.ts.map