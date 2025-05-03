import Fuse from "fuse.js";
import { Model, SortOrder } from "mongoose";
import Category from "../models/category.model";

export class SearchService {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async search(queryParams: any): Promise<{ results: number, uniqueCategories: any[] }>  {
    try {
      const lowercaseQuery = queryParams.q.toLowerCase();
  
      const query = {
        $or: [{ productName: { $regex: lowercaseQuery, $options: "i" } }, { shortDescription: { $regex: lowercaseQuery, $options: "i" } }]
      };
  
      if (queryParams.filter) {
        if (queryParams.filterField === "manufacturer") {
          query["manufacturer"] = queryParams.filter;
        } else if (queryParams.filterField === "status") {
          query["status"] = queryParams.filter;
        } else if (queryParams.filterField === "price") {
          query["price"] = queryParams.filter;
        } else if (queryParams.filterField === "inStock") {
          query["inStock"] = queryParams.filter;
        } else if (queryParams.filterField === "stock") {
          query["stock"] = queryParams.filter;
        } else if (queryParams.filterField === "category") {
          query["categories"] = queryParams.filter; 
        } else if (queryParams.filterField === "productName") {
          query["productName"] = queryParams.filter;
        } else if (queryParams.filterField === "status") {
          query["status"] = queryParams.filter;
        } else if (queryParams.filterField === "manufacturer") {
          query["manufacturer"] = queryParams.filter;
        } else if (queryParams.filterField === "isDiscount") {
          query["isDiscount"] = queryParams.filter;
        } else if (queryParams.filterField === "rating") {
          query["rating"] = queryParams.filter;
        }
      }
  
      const sortField = queryParams.sort || "relevance";
      const sortOrder = queryParams.order === "desc" ? -1 : 1;
      const sortOptions = { [sortField]: sortOrder } as Record<string, SortOrder>;
  
      let searchResults = await this.model.find(query).sort(sortOptions).populate("categories").exec();
      let totalCount = await this.model.countDocuments(query).exec();

      const fuse = new Fuse(searchResults, {
        keys: ['productName', 'shortDescription'],
        includeScore: true,
        threshold: 0.4, 
      });

      searchResults = fuse.search(lowercaseQuery).map(({ item }) => item);
      totalCount = searchResults.length;

      // Extract unique category IDs
      const uniqueCategoryIds = [...new Set(searchResults.flatMap(result => result.categories.map(category => category._id)))];

      // Populate unique category details
      const uniqueCategories = await Category.find({ _id: { $in: uniqueCategoryIds } }).exec();
      
      return { results: totalCount, uniqueCategories };
    } catch (error) {
      console.error(error);
      throw new Error("Error performing search");
    }
  }
}   