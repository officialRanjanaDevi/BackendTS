import { HeaderService } from "../../services/header.service";
import { NextFunction, Request, Response } from "express";

export class HeaderController{
    static async createHeader(request: Request, response: Response, next: NextFunction) {
        try {
            const { title, products, subcategory } = request.body;

            if (!title || !products || !subcategory) {
                throw new Error("Missing required fields: title, products, subcategory");
            }

            const headerService = new HeaderService();
            const result = await headerService.createHeader({ title, products, subcategory });
            response.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getHeaders(request: Request, response: Response, next: NextFunction) {
        try {
            const { subcategoryId } = request.params;
            const headerService = new HeaderService();
            const headers = await headerService.getHeaders(subcategoryId);
            
            response.status(200).json(headers);
        } catch (error) {
            next(error);
        }
    }

    
 
    

}