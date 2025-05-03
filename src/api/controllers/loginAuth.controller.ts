import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/loginAuth.service";
import User from "../../models/user.model";
import { generateToken } from "../../middlewares/security.middleware";

export class LoginAuthController {
  static async sendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { mobileNumber } = req.body;

    try {
      // Check if the mobileNumber is not empty
      if (!mobileNumber) {
        res.status(400).json({ message: "Mobile number is required" });
        return;
      }

      // Check if the mobileNumber matches the format of "+91" followed by 10 digits
      const mobileNumberRegex = /^\+91\d{10}$/;
      if (!mobileNumberRegex.test(mobileNumber)) {
        res.status(400).json({ message: "Invalid mobile number format" });
        return;
      }

      await authService.sendOTP(mobileNumber);
      res.status(200).json({ message: "OTP sent successfully" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
      return;
    }
  }

  static async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { mobileNumber, otp } = req.body;
    try {
      const result = await authService.verifyOTP(mobileNumber, otp);
      if (result.success) {
        const user = await User.findOne({
          phone_number: mobileNumber
        }).exec();
        if (!user) {
          res.status(400).json({ Login: "Unsuccessful", error: "User not found" });
        }
        const token = generateToken(req, res, next, user);
        res.json({ message: "OTP verified successfully", result: { UserData: user }, token });
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  }
}
