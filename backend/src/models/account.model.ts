import { IAccount } from './../interfaces/model.interfaces';
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema<IAccount> (
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,   
      trim: true,
    }, 
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    }, 
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee"
    }, 
    isActive: {
      type: Boolean,
      default: true,
    }, 
    deleted: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true,
  }
)

const Account = mongoose.model<IAccount>("Account", accountSchema, "accounts")

export default Account