import mongoose, { Document, Schema } from "mongoose";

export interface OTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  mobileNumber: string;
}

const otpSchema = new Schema<OTP>({
  email: {
    type: String,
    required: false
  },
  mobileNumber: { type: String, required: false },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5
  }
});

const OTP = mongoose.model<OTP>("OTP", otpSchema);

export default OTP;
