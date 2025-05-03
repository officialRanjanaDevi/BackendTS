import Header from '../models/header.model';

export class HeaderService {
    async createHeader(data : any) {
        try {
            const header = new Header(data);
            return header.save();
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getHeaders(subcategoryId: string) {
        try {
            const headers = await Header.find({ subcategory: subcategoryId }).exec();
            return headers;
        }
        catch (error) {
            throw new Error(error.message);
        }
        
    }
}