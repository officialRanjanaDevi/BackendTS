import Clothing, {IClothing} from "../models/clothing.model";

export class ClothingService {
    
    // Adds a new clothing item to the database.
    async addClothing(data: any): Promise<IClothing> {
        const clothing = new Clothing(data);
        return clothing.save();
    }

    // Retrieves all clothing items from the database.
    async getAllClothing(): Promise<IClothing[]> {
        return Clothing.find();
    }

    // Get clothing by filter
    async getClothingByFilter(filter: { gender?: string, categoryId?: string }): Promise<IClothing[]> {
        const query: any = {};

        if (filter.gender) {
            query.gender = filter.gender;
        }
        if (filter.categoryId) {
            query.category = filter.categoryId;
        }
        return Clothing.find(query);
    }


}

