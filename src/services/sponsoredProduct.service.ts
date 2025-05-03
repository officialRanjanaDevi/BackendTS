import SponsoredProduct from '../models/sponsoredProduct.model';

export class SponsoredProductService {
    async createSponsoredProduct(productId: string, categoryId: string, subcategoryId: string) {
        try {
            const sponsoredProduct = new SponsoredProduct({
                productId,
                categoryId,
                subcategoryId
            });
            return sponsoredProduct.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSponsoredProductsBySubcategoryId(subcategoryId: string) {
        try {
            const sponsoredProducts = await SponsoredProduct.find({ subcategoryId })
                .limit(2)
                .populate({
                    path:'productId',
                    model: 'product'
                    
                })
                .exec();
            return sponsoredProducts;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async   getSponsoredProducts() {
        try {
            const sponsoredProducts = await SponsoredProduct.find({})
                .populate({
                    path:'productId',
                    model: 'product'
                    
                })
                .exec();
            return sponsoredProducts;
        } catch (error) {
            throw new Error(error.message);
        }
    }
  
}