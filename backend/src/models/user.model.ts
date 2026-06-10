import mongoose from "mongoose";
import { IUser } from "../interfaces/model.interfaces";

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    info: {
      height: String,
      weight: String,
      dob: String,
    },
    addresses: [
      {
        name: { type: String }, // Tên người nhận hàng
        phone: { type: String }, // SĐT nhận hàng
        email: { type: String }, // Email nhận hàng
        province: {
          type: String,
        }, // Tỉnh/Thành
        district: {
          type: String,
        }, // Quận/Huyện
        ward: {
          type: String,
        }, // Phường/Xã
        address: { type: String }, // Số nhà, đường...
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    strikeCount: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
