import { NextFunction, Request, Response } from "express";
import { SellerService } from "../../services/seller.service";
import { userAdd, userCreation, userUpdate } from "./../../validation/user.schema";
import { generateToken } from "../../middlewares/security.middleware";

export class SellerController {
  // @validateRequestBody(sellerCreation)
  static async sellerSignUp(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      
      const result: any = await new SellerService().createSeller({ ...request.body });

      const token = generateToken(request, response, next, result);
      response.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(sellerAdd)
  static async createSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
     
      const result: any = await new SellerService().createSeller({ ...request.body });
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAllSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const result = await new SellerService().getAllSeller(l, p);
      const sellers: any = await new SellerService().getAllSeller(0, 0);
      response.status(200).json({ totalCount: sellers.length, page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result, totalUsers: sellers });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOneSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().getOneSeller(request.params._id, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // @validateRequestBody(sellerUpdate)
  static async updateSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().updateOneSeller(request.params._id, request.body, language);
      response.json(result);
    } catch (err) {
      console.log({ err });
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async deleteSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().deleteSeller(request.params._id, language);
      response.json(result);
    } catch (err) {
      console.log({ err });
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async revokeSeller(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new SellerService().revokeSeller(request.params._id, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async uploadImage(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const file = request.file;
      const image = {
        filename: file.filename,
        url: file.path
      };
      const result = await new SellerService().uploadImage(request.params.sellerId, image);
      response.status(200).json({ comment: "file uploaded successfully", data: result, newFile: image });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async uploadDocumentVerification(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const documents: Array<{ name: string; url: string }> = request.body.documents;
      const result = await new SellerService().uploadDocumentVerification(request.params.sellerId, documents);
      response.status(200).json({ message: "Document verification submitted successfully", data: result });
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static logout(req: Request, res: Response, next: NextFunction) {
    // clear the session, can be done at front end
    res.status(200).json({ message: "Logged Out!" });
  }
}
