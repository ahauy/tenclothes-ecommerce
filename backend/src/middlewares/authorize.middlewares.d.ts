import { IAuthRequest } from "./authen.middlewares";
import { Response, NextFunction } from "express";
export declare const authorizationRole: (allowedRoles: string[]) => (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authorize.middlewares.d.ts.map