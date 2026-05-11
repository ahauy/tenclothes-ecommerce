import mongoose from "mongoose";
import { IProductLog } from "../interfaces/model.interfaces";
declare const ProductLog: mongoose.Model<IProductLog, {}, {}, {}, mongoose.Document<unknown, {}, IProductLog, {}, mongoose.DefaultSchemaOptions> & IProductLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProductLog>;
export default ProductLog;
//# sourceMappingURL=productLog.model.d.ts.map