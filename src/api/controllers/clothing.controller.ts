import { NextFunction, Request, Response } from "express";
import { ClothingService } from "../../services/clothing.service";

export class ClothingController {

    // Adds a new clothing item to the database.
    static async addClothing(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await new ClothingService().addClothing(request.body);
            response.status(201).json(result);
        } catch (err) {
            const error = JSON.parse(err.message);
            next({ code: error.code, message: error.message, error: error.error })
        }
    }
    
    // Retrieves all clothing items from the database.
    static async getAllClothing(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await new ClothingService().getAllClothing();
            response.status(200).json(result);
        } catch (err) {
            const error = JSON.parse(err.message);
            next({ code: error.code, message: error.message, error: error.error })
        }
    }

    // Get clothing by filter
    static async getClothingByFilter(request: Request, response: Response, next: NextFunction) {
        try {
            const { gender, categoryId } = request.query;
            const filter = {} as { gender?: string, categoryId?: string };

            if (gender) {
                filter.gender = gender.toString();
            }

            if (categoryId) {
                filter.categoryId = categoryId.toString();
            }

            const result = await new ClothingService().getClothingByFilter(filter);
            response.status(200).json(result);
        } catch (err) {
            const error = JSON.parse(err.message);
            next({ code: error.code, message: error.message, error: error.error })
        }
    }
}