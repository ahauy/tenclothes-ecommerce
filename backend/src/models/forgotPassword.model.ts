import mongoose from "mongoose";
import { IForgotPassword } from "../interfaces/model.interfaces";

const forgotPasswordSchema = new mongoose.Schema<IForgotPassword>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index will delete this document at expireAt time
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model<IForgotPassword>(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

export default ForgotPassword;
