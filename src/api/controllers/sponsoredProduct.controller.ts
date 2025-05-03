import { Request, Response, NextFunction } from 'express';
import { SponsoredProductService } from '../../services/sponsoredProduct.service';
import SponsoredProduct from '../../models/sponsoredProduct.model';
import Product from '../../models/product.model';
export class SponsoredProductController {
    static async createSponsoredProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId, categoryId, subcategoryId } = req.body;
            const sponsoredProductService = new SponsoredProductService();
            const result = await sponsoredProductService.createSponsoredProduct(productId, categoryId, subcategoryId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getSponsoredProductsBySubcategory(req: Request, res: Response, next: NextFunction) {
        try {
            const subcategoryId = req.params.subcategoryId;
            const sponsoredProductService = new SponsoredProductService();
            const sponsoredProducts = await sponsoredProductService.getSponsoredProductsBySubcategoryId(subcategoryId);
            res.status(200).json(sponsoredProducts);
        } catch (error) {
            next(error);
        }
    }
    static async  getAllSponsoredProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const sponsoredProductService = new SponsoredProductService();
            const sponsoredProducts = await sponsoredProductService.getSponsoredProducts();
           res.status(200).json(sponsoredProducts);
        } catch (error) {
            next(error);
        }
    }

   
}
