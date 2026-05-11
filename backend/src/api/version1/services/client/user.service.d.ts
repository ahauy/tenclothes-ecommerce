import { IUpdateProfileBody, IChangePasswordBody, IAddressBody } from "../../validators/client/user.validator";
export declare const getProfileService: (userId: string) => Promise<{
    _id: import("mongoose").Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    info: {
        dob: string;
        height: string;
        weight: string;
    };
}>;
export declare const updateProfileService: (userId: string, data: IUpdateProfileBody) => Promise<{
    _id: import("mongoose").Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    info: {
        dob: string;
        height: string;
        weight: string;
    };
}>;
export declare const changePasswordService: (userId: string, data: IChangePasswordBody) => Promise<void>;
export declare const getAddressesService: (userId: string) => Promise<import("mongoose").Types.DocumentArray<import("../../../../interfaces/model.interfaces").IAddresses, import("mongoose").Types.Subdocument<never, unknown, import("../../../../interfaces/model.interfaces").IAddresses, {}, {}> & import("../../../../interfaces/model.interfaces").IAddresses> | never[]>;
export declare const addAddressService: (userId: string, data: IAddressBody) => Promise<import("mongoose").Types.DocumentArray<import("../../../../interfaces/model.interfaces").IAddresses, import("mongoose").Types.Subdocument<never, unknown, import("../../../../interfaces/model.interfaces").IAddresses, {}, {}> & import("../../../../interfaces/model.interfaces").IAddresses> | undefined>;
export declare const updateAddressService: (userId: string, addressId: string, data: IAddressBody) => Promise<import("mongoose").Types.DocumentArray<import("../../../../interfaces/model.interfaces").IAddresses, import("mongoose").Types.Subdocument<never, unknown, import("../../../../interfaces/model.interfaces").IAddresses, {}, {}> & import("../../../../interfaces/model.interfaces").IAddresses> | undefined>;
export declare const deleteAddressService: (userId: string, addressId: string) => Promise<import("mongoose").Types.DocumentArray<import("../../../../interfaces/model.interfaces").IAddresses, import("mongoose").Types.Subdocument<never, unknown, import("../../../../interfaces/model.interfaces").IAddresses, {}, {}> & import("../../../../interfaces/model.interfaces").IAddresses> | undefined>;
export declare const setDefaultAddressService: (userId: string, addressId: string) => Promise<import("mongoose").Types.DocumentArray<import("../../../../interfaces/model.interfaces").IAddresses, import("mongoose").Types.Subdocument<never, unknown, import("../../../../interfaces/model.interfaces").IAddresses, {}, {}> & import("../../../../interfaces/model.interfaces").IAddresses> | undefined>;
//# sourceMappingURL=user.service.d.ts.map