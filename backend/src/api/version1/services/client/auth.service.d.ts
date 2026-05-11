import { IRegisterReqBody } from "../../validators/client/auth.validator";
export declare const registerService: (registerData: IRegisterReqBody) => Promise<{
    _id: string;
    fullName: string;
    email: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map