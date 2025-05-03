import { NextFunction, Request, Response } from "express";
import VerificationModel from "../../models/verification.model";

// Define a custom type for file uploads
interface CustomRequest extends Request {
  files?: Express.Multer.File[];
}

export class VerificationController {
  static async mainVerification(request: CustomRequest, response: Response, next: NextFunction): Promise<void> {
    try {
      const { sellerId } = request.params;
      const { aadharNumber, panNumber, GstinNumber, fullName, accountNumber, ifscCode } = request.body;

      // Explicitly define the type for allFiles
      const allFiles: Express.Multer.File[] = request.files || [];

      const formData = await VerificationModel.create({
        sellerId,
        aadharNumber,
        panNumber,
        GstinNumber,
        fullName,
        accountNumber,
        ifscCode,
        aadharUpload: allFiles.find((file) => file.fieldname === "aadharUpload"),
        panUpload: allFiles.find((file) => file.fieldname === "panUpload"),
        GstinUpload: allFiles.find((file) => file.fieldname === "GstinUpload"),
        accountUpload: allFiles.find((file) => file.fieldname === "accountUpload")
      });

      console.log("Form data and file details saved to the database:");

      response.json({ status: "ok" });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      next({ code: 500, message: error.message, error: error });
    }
  }


  static async getFile(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const {sellerId}=request.params;
      const result = await VerificationModel.find({ sellerId: sellerId}).populate("sellerId").exec();
      console.log("Result:", result);
      response.status(200).json({ page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result});
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
