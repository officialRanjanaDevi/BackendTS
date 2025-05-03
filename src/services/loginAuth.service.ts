import twilio from "twilio";
import OTP from "../models/otp.model";

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioClient = twilio(accountSid, authToken);

export class authService {
  static async sendOTP(mobileNumber: string): Promise<void> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      // Check if an OTP already exists for the given mobile number
      const existingOTP = await OTP.findOne({ mobileNumber });

      // If OTP exists, delete it
      if (existingOTP) {
        await OTP.deleteMany({ mobileNumber });
      }

      // Send SMS OTP using Twilio (uncomment in production)
      // await twilioClient.messages.create({
      //   body: `Your OTP is: ${otp}`,
      //   from: `+14705704179`,
      //   to: mobileNumber,
      // });

      // Create new OTP record
      const otpPayload = { mobileNumber, otp };
      await OTP.create(otpPayload);
    } catch (error) {
      throw new Error("Failed to send OTP");
    }
  }

  static async verifyOTP(mobileNumber: string, otp: string): Promise<{ success: boolean }> {
    try {
      // Find the OTP record for the provided mobile number
      const otpRecord = await OTP.findOne({ mobileNumber });

      // Check if the OTP exists and matches
      if (!otpRecord || otpRecord.otp !== otp) {
        return { success: false };
      }

      // OTP is valid, delete the record after successful verification
      await OTP.deleteOne({ mobileNumber });

      return { success: true };
    } catch (error) {
      throw new Error("Failed to verify OTP");
    }
  }
}
