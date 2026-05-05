import mongoose from "mongoose";
import ProductLog from "../models/productLog.model";

export interface IStaffReq {
  _id: string | mongoose.Types.ObjectId;
  email?: string;
  role?: string;
  fullName?: string;
}

// Helper ghi log
const writeProductLog = async (
  productId: string | mongoose.Types.ObjectId,
  action: string,
  staff: IStaffReq,
  changes?: Record<string, { from?: unknown; to?: unknown }>
) => {
  const logData: Record<string, unknown> = {
    productId,
    action,
    performedBy: staff._id,
    actorInfo: {
      fullName: (staff.fullName || (staff.email ? staff.email.split("@")[0] : "Unknown")) as string,
      role: (staff.role || "Unknown") as string,
      email: (staff.email || "unknown@example.com") as string,
    },
  };
  if (changes) {
    logData["changes"] = changes;
  }
  await ProductLog.create(logData);
};

export default writeProductLog;
