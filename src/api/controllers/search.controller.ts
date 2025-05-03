import { NextFunction, Request, Response } from "express";
import { SearchService } from "../../services/search.service";
import Product from "../../models/product.model";

export class SearchController {
  static async search(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = request.query;

      if (!queryParams.q) {
        response.status(400).json({ error: "Missing 'q' parameter" });
        return;
      }

      const searchService = new SearchService(Product);
      const searchResults = await searchService.search(queryParams);

      response.status(200).json(searchResults);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}