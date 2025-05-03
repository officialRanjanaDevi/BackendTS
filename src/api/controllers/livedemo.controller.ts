import { NextFunction, Request, Response } from "express";
import { LiveDemoService } from "../../services/livedemo.service";
import { Schema } from "mongoose";
export class LiveDemoController {
  static async getLiveDemo(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const customerId = request.params.customerId;
      const result = await new LiveDemoService().getLiveDemo(customerId, language);
      response.json(result);
    } catch (err) {
      console.log("err", err);
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);

      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getLiveDemoByStore(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = request.params.customerId;
      const storeId = request.params.storeId;
      const result = await new LiveDemoService().getLiveDemoByStore(customerId, storeId);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async addItem(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: string = (request.headers["content-lang"] as string) ?? "en";
      const { productId, customerId } = request.body;

      if (!productId || !customerId) {
        return next({ code: 400, message: "Missing productId or customerId in query" });
      }

      // Cast to string to ensure proper typing
      const result = await new LiveDemoService().addItem(productId, customerId, language);

      response.json(result);
    } catch (err) {
      // Ensure error is properly formatted
      const error = err instanceof Error ? err.message : "Unknown error";
      const errorResponse = {
        code: 500,
        message: error,
        error: err
      };

      console.error("Error in addItem:", errorResponse); // Log error for debugging
      next(errorResponse);
    }
  }

  static async removeProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = request.user.id; // Extracting customerId from authenticated user
      const { productId } = request.params;
      const result = await new LiveDemoService().removeProduct(customerId, productId);
      response.json(result);
    } catch (err) {
      next(err);
    }
  }
}
