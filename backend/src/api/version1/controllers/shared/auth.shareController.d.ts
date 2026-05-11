import { Request, Response } from "express";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
import { Model } from "mongoose";
export declare const loginShareController: (DataModel: Model<any>) => (req: Request<{}, {}, ILoginReqBody>, res: Response) => Promise<void>;
export declare const refreshShareController: () => (req: Request, res: Response) => Promise<void>;
export declare const logoutShareController: () => (_req: Request, res: Response) => void;
//# sourceMappingURL=auth.shareController.d.ts.map