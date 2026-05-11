import { Response } from "express";
import { IAuthRequest } from "../../../../middlewares/authen.middlewares";
import { IUpdateProfileBody, IChangePasswordBody, IAddressBody } from "../../validators/client/user.validator";
export declare const getProfileController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const updateProfileController: (req: IAuthRequest & {
    body: IUpdateProfileBody;
}, res: Response) => Promise<void>;
export declare const changePasswordController: (req: IAuthRequest & {
    body: IChangePasswordBody;
}, res: Response) => Promise<void>;
export declare const getAddressesController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const addAddressController: (req: IAuthRequest & {
    body: IAddressBody;
}, res: Response) => Promise<void>;
export declare const updateAddressController: (req: IAuthRequest & {
    body: IAddressBody;
}, res: Response) => Promise<void>;
export declare const deleteAddressController: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const setDefaultAddressController: (req: IAuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map