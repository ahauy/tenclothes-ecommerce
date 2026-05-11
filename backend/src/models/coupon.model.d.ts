import mongoose from "mongoose";
import { ICoupon } from "../interfaces/model.interfaces";
export declare const Coupon: mongoose.Model<ICoupon, {}, {}, {}, mongoose.Document<unknown, {}, ICoupon, {}, mongoose.DefaultSchemaOptions> & ICoupon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICoupon>;
//# sourceMappingURL=coupon.model.d.ts.map