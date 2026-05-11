import { IAccount } from './../interfaces/model.interfaces';
import mongoose from "mongoose";
declare const Account: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount, {}, mongoose.DefaultSchemaOptions> & IAccount & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAccount>;
export default Account;
//# sourceMappingURL=account.model.d.ts.map