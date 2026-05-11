import { Model } from "mongoose";
import { ILoginReqBody } from "../../validators/shared/loginSchema.validate";
export declare const loginShareService: (DataModal: Model<any>, dataLogin: ILoginReqBody) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: any;
} | null>;
export declare const verifyRefreshTokenShareService: (refreshToken: string) => (string | Error);
//# sourceMappingURL=auth.sharedServices.d.ts.map