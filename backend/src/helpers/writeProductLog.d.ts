import mongoose from "mongoose";
export interface IStaffReq {
    _id: string | mongoose.Types.ObjectId;
    email?: string;
    role?: string;
    fullName?: string;
}
declare const writeProductLog: (productId: string | mongoose.Types.ObjectId, action: string, staff: IStaffReq, changes?: Record<string, {
    from?: unknown;
    to?: unknown;
}>) => Promise<void>;
export default writeProductLog;
//# sourceMappingURL=writeProductLog.d.ts.map