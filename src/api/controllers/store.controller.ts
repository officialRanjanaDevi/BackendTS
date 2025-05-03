import { NextFunction, Request, Response } from "express";
import { StoreService } from "../../services/store.service";
import Store, { StoreStatus } from "../../models/store.model";
import mongoose from "mongoose";
import Category from "../../models/category.model";
export class StoreController {
  static async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const result: any = await new StoreService().createStore({ ...request.body }, request.params.sellerId);
      // console.log(result);
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const result = await new StoreService().getAllStore(request.params.sellerId, l, p);
      const stores: any = await new StoreService().getAllStore(request.params.sellerId, 0, 0);
      response.status(200).json({ totalCount: stores.length, page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result, totalStores: stores });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAll2(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());
      const filters = request.body.filters ?? {};

      const result = await new StoreService().getAllStore2(filters, l, p);
      const stores: any = await new StoreService().getAllStore2(filters, 0, 0);
      const categories=await Category.find({parent:null});
      response.status(200).json({categories:categories, totalCount: stores.length, page: Number(page) ?? 0, limit: Number(limit) ?? 0, data: result, totalStores: stores });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOne(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().getOneStore(request.params.sellerId, request.params._id, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getOne2(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().getOneStore2(request.params._id, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().deleteStore(request.params.sellerId, request.params._id, language);
      response.json(result);
    } catch (err) {
      console.log({ err });
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async revoke(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().revokeStore(request.params._id, language);
      response.json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result = await new StoreService().updateOneStore(request.params.sellerId, request.params._id, request.body, language);
      response.json(result);
    } catch (err) {
      console.log({ err });
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async uploadImage(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const file = request.file;
      const image = {
        filename: file.filename,
        url: file.path
      };

      const result = await new StoreService().uploadImage(request.params.storeId, image);

      response.status(200).json({ comment: "file uploaded successfully", data: result, newFile: image });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // Follow a store by customer
  static async followStore(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = request.params;
      const customerId = request.user.id; //take the user id extracted from token
      if (!storeId) response.status(400).json({ Error: "Store ID not found!" });
      const result = await new StoreService().followStore(storeId, customerId);
      response.status(200).json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  // Unfollow a store by customer
  static async unfollowStore(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = request.params;
      const customerId = request.user.id; //take the user id extracted from token
      if (!storeId) response.status(400).json({ Error: "Store ID not found!" });
      const result = await new StoreService().unfollowStore(storeId, customerId);
      response.status(200).json(result);
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      console.log({ error });
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async createOffer(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = request.params;
      const offerData = request.body;
      const result = await new StoreService().createOffer(storeId, offerData);
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async updateOffer(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, offerId } = request.params;
      const offerData = request.body;
      const result = await new StoreService().updateOffer(storeId, offerId, offerData);
      response.json(result);
    } catch (err) {
      console.log({ err });
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async markMerchantAsPopular(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const merchantId = request.params.merchantId;
      const updatedMerchantData = {
        status: StoreStatus.active
      };
      const updatedMerchant = await new StoreService().updateMerchant(merchantId, updatedMerchantData);
      response.status(200).json(updatedMerchant);
    } catch (err) {
      next({ code: 500, message: err.message, error: null });
    }
  }
  static async getMarkedPopularMerchants(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
     
      const markedPopularMerchants = await new StoreService().getMarkedPopularMerchants();
    
      response.status(200).json(markedPopularMerchants);
    } catch (err) {
      next({ code: 500, message: err.message, error: null });
    }
  }



  static async getMarkedPopularMerchantsByCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {

      const categoryId = request.params.categoryId;
      
      const markedPopularMerchants = await new StoreService().getMarkedPopularMerchantsByCategory(categoryId);
      
      response.status(200).json(markedPopularMerchants);
    } catch (err) {
      next({ code: 500, message: err.message, error: null });
    }
  }

  // static async getMarkedPopularMerchants(request: Request, response: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const categoryId = request.params.categoryId; // Assuming the category ID is passed as a route parameter
  //     const markedPopularMerchants = await new StoreService().getMarkedPopularMerchantsByCategory(categoryId);
  //     response.status(200).json(markedPopularMerchants);
  //   } catch (err) {
  //     next({ code: 500, message: err.message, error: null });
  //   }
  // }

  // static async getMarkedPopularMerchants(request: Request, response: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const markedPopularMerchants = await new StoreService().getMarkedPopularMerchants();
  //     response.status(200).json(markedPopularMerchants);
  //   } catch (err) {
  //     next({ code: 500, message: err.message, error: null });
  //   }
  // }

  static async getNearbyStores(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { latitude, longitude, maxDistance = 5000 } = request.query;

      if (!latitude || !longitude || !maxDistance) {
        throw new Error("Latitude, longitude, and maxDistance are required.");
      }

      const latitudeNum = parseFloat(latitude as string);
      const longitudeNum = parseFloat(longitude as string);
      const maxDistanceNum = parseFloat(maxDistance as string);

      if (isNaN(latitudeNum) || isNaN(longitudeNum) || isNaN(maxDistanceNum)) {
        throw new Error("Invalid latitude, longitude, or maxDistance values.");
      }

      // console.log("latitude:", latitudeNum);
      // console.log("longitude:", longitudeNum);
      // console.log("maxDistance:", maxDistanceNum);

      const { limit = "0", page = "1" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());

      const { filters } = request.body ?? {};
      // const categoryId = filters.categories[0] && filters.categories.length > 0 && null;
      const nearbyStores = await new StoreService().
      getNearbyAllStores({ latitude: latitudeNum, longitude: longitudeNum, maxDistance: maxDistanceNum, ...filters }, l, p);

      if (!nearbyStores) {
        throw new Error("No nearby stores found.");
      }

      response.status(200).json(nearbyStores);
    } catch (error) {
      console.error("Error:", error);
      response.status(400).json({ error: error.message });
    }
  }
  
  static async getNearbyStoresByCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {id}=request.params
      const { latitude, longitude, maxDistance = 5000 } = request.query;
      console.log(request.query)
      if (!latitude || !longitude || !maxDistance) {
        throw new Error("Latitude, longitude, and maxDistance are required.");
      }

      const latitudeNum = parseFloat(latitude as string);
      const longitudeNum = parseFloat(longitude as string);
      const maxDistanceNum = parseFloat(maxDistance as string);

      if (isNaN(latitudeNum) || isNaN(longitudeNum) || isNaN(maxDistanceNum)) {
        throw new Error("Invalid latitude, longitude, or maxDistance values.");
      }

  
      const { limit = "10", page = "0" } = request.query;
      const l = parseInt(limit.toString());
      const p = parseInt(page.toString());

      const { filters } = request.body ?? {};
      const nearbyStores = await new StoreService().getNearbyAllStoresByCategory({
        latitude: latitudeNum, longitude: longitudeNum, maxDistance: maxDistanceNum, ...filters
    }, l, p,id);

      if (!nearbyStores) {
        throw new Error("No nearby stores found.");
      }

      response.status(200).json(nearbyStores);
    } catch (error) {
      console.error("Error:", error);
      response.status(400).json({ error: error.message });
    }
  }


  static async getStoreById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      const store = await Store.findById(id);
      if (store) {
        res.json(store);
      } else {
        res.status(404).json({ error: "Meeting not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
