import { NextFunction, Request, Response } from "express";
import { FaqService } from "../../services/faq.service";


export class FaqController {
// Create a new FAQ 
    static async createFaq(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const result: any = await new FaqService().createFaq({ ...request.body });
            response.status(201).json(result);
        } catch (err) {
            const error = JSON.parse(err.message);
            next({ code: error.code, message: error.message, error: error.error });
        }
    }

// Get all FAQs
    static async getAllFaq(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const faqs = await new FaqService().getAllFaq();
            response.status(200).json(faqs);
          } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Internal Server Error" });
          }
}
}