import Store, { StoreStatus } from "../models/store.model";
import { IOfferCreate, IOfferUpdate, IStoreCreate, IStoreUpdate } from "../interfaces/store.interface";
// import { Point } from "geojson";
import { buildQuery } from "../helpers/queryBuilder";
import Category from "../models/category.model";
import mongoose from "mongoose";
import Product from "../models/product.model";
import Address from "../models/address.model";
export class StoreService {
  async createStore(data, sellerId: string) {
    try {
      const storeDetails = {
        sellerId,
        ...data.storeDetails
      };
      const store = new Store(storeDetails);
      const result1 = await store.save();

      const storeId = result1._id;
      const addressDetails = {
        refId: storeId,
        type: "store",
        ...data.addressDetails
      };

      const result2 = await new Address(addressDetails).save();

      return { data: result1, address: result2 };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllStore(sellerId: string, limit: number, page: number, language?: string) {
    const stores = await Store.find({ sellerId: sellerId })
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    return stores;
  }

  async getAllStore2(filters: Record<string, any>, limit: number, page: number, language?: string) {
    const query: any = buildQuery(filters);

    const stores = await Store.find(query).sort({ "rating.count": -1 })
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec()
      ;
    return stores;
  }

  async getOneStore(sellerId: string, storeId: string, language?: string) {
    const store = await Store.findOne({ sellerId: sellerId, _id: storeId }).populate("sellerId").exec();
    console.log(store)
    return store;
  }

  async getOneStore2(storeId: string, language?: string) {
    const store = await Store.findOne({ _id: storeId }).populate("categories").populate("sellerId").populate({ path: "followers.followers", model: "user" }).exec();
    return store;
  }

  async updateOneStore(sellerId: string, storeId: string, body: IStoreUpdate, language?: string) {
    const store = await Store.findOne({ sellerId: sellerId, _id: storeId }).exec();

    if (body.openingHours) {
      if (body.openingHours.openTime) store.openingHours.openTime = body.openingHours.openTime;
      if (body.openingHours.closeTime) store.openingHours.closeTime = body.openingHours.closeTime;
    }

    return await store.save();
  }

  async deleteStore(sellerId: string, storeId: string, language?: string) {
    const result = await Store.findOneAndUpdate({ sellerId: sellerId, _id: storeId }, { $set: { status: "inactive" } }, { new: true }).exec();
    return result;
  }

  async revokeStore(storeId: string, language?: string) {
    return await Store.findByIdAndRemove({ _id: storeId }).exec();
  }

  async uploadImage(storeId: string, image: any) {
    return await Store.findByIdAndUpdate(storeId, { $push: { images: image } }).exec();
  }

  // Follow Store by Customer
  async followStore(storeId: string, customerId: string) {
    const store = await Store.findById(storeId);

    if (!store) {
      return { Error: "Store not found!" };
    }

    const isFollowed = store.followers.followers.includes(customerId);

    if (isFollowed) {
      return { Error: "Store already followed!" };
    }

    const storeFollowed = await Store.findByIdAndUpdate(
      storeId,
      {
        $inc: { "followers.count": 1 },
        $push: { "followers.followers": customerId }
      },
      { new: true }
    ).populate({ path: "followers.followers", model: "user" });

    return { Message: "Store Followed Successfully!", data: storeFollowed };
  }

  //Unfollow Store by Customer
  async unfollowStore(storeId: string, customerId: string) {
    const store = await Store.findById(storeId);

    if (!store) {
      return { Error: "Store not found!" };
    }

    const storeUnfollowed = await Store.findByIdAndUpdate(
      storeId,
      {
        $inc: { "followers.count": -1 },
        $pull: { "followers.followers": customerId }
      },
      { new: true }
    ).populate({ path: "followers.followers", model: "user" });
    return { Message: "Store Unfollowed Successfully!", data: storeUnfollowed };
  }

  async createOffer(storeId: string, offerData: IOfferCreate) {
    const store = await Store.findById(storeId);
    store.offers.push(offerData);
    return store.save();
  }

  async updateOffer(storeId: string, offerId: string, offerData: IOfferUpdate) {
    const store = await Store.findById(storeId);
    const offer = store.offers.id(offerId);
    offer.set(offerData);
    return store.save();
  }

  async updateMerchant(merchantId: string, dataToUpdate: any): Promise<any | null> {
    try {
      const updatedMerchant = await Store.findByIdAndUpdate(merchantId, dataToUpdate, { new: true }).exec();
      return updatedMerchant;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getMarkedPopularMerchantsByCategory(categoryId: string): Promise<any[]> {
    try {
     
      const categories = await Category.find({ parent: categoryId });
  
      const categoryIds = categories.map(category => category._id.toString());
      categoryIds.push(categoryId.toString());
  
      const allStores = await Store.find({ status: { $in: ["Active", "active"] } })
      .sort({ "rating.rating": -1 })
      .exec();
    
  
      const filteredStores = allStores.filter(store =>
        Array.isArray(store.categories) &&
        store.categories.some(cat => categoryIds.includes(cat.toString()))
      );
  
      return filteredStores;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  
  

  async getMarkedPopularMerchants(): Promise<any[]> {
    try {
    
      const markedPopularMerchants = await Store.find({
        status: StoreStatus.active,
        "followers.count": { $exists: true, $gt: 0 }
      }).sort({ "rating.rating": -1 }) 
        .populate("sellerId")
        .exec();
       
      return markedPopularMerchants;
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }

  // async function getMarkedPopularMerchantsByCategory(categoryId: string): Promise<any[]> {
  //   try {
  //     const markedPopularMerchants = await Store.find({
  //       status: StoreStatus.active,
  //       followers: { $exists: true, $not: { $size: 0 } },
  //       categories: categoryId, // Filter by category ID
  //     })
  //       .populate("sellerId followers.followers")
  //       .exec();

  //     return markedPopularMerchants;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  async getNearbyAllStores(filters: Record<string, any>, limit: number, page: number): Promise<{ [subcategory: string]: any[] }> {
    const result: { [subcategory: string]: any[] } = {};

    // Fetch stores based on filters
    const query: any = buildQuery(filters);
    const nearbyStores = await Store.find(query)
      .skip(page * limit)
      .limit(limit)
      .lean()
      .exec();

    // Fetch subcategories based on the categoryId
    const categoryId = filters.categories[0] && filters.categories.length > 0 && null;
    const subcategories = await Category.find({ parent: categoryId }).exec();

    // Create a map to store stores by subcategory
    const storesBySubcategory = new Map<string, any[]>();

    // Iterate through nearby stores and group them by subcategory
    nearbyStores.forEach((store) => {
      const subcategoryId = store.categories.find((catId: mongoose.Types.ObjectId) => {
        return subcategories.some((subcategory) => subcategory._id.equals(catId));
      });

      if (subcategoryId) {
        const subcategoryName = subcategories.find((subcategory) => subcategory._id.equals(subcategoryId))?.name;

        if (subcategoryName) {
          if (!storesBySubcategory.has(subcategoryName)) {
            storesBySubcategory.set(subcategoryName, []);
          }

          storesBySubcategory.get(subcategoryName)?.push(store);
        }
      }
    });

    // Convert the map to the desired result format
    storesBySubcategory.forEach((stores, subcategoryName) => {
      result[subcategoryName] = stores;
    });

    return result;
  }

  async getNearbyAllStoresByCategory(
    filters: Record<string, any>,
    limit: number,
    page: number,
    id:string
  ): Promise<any[]> {
   
    const categoryId = new mongoose.Types.ObjectId(id);

  // Add category filter
  const query = { ...filters, categories: { $in: [categoryId] } };

  // Fetch stores that contain the given category ID
    
    const nearbyStores = await Store.find({categories: { $in: [categoryId] }}).sort({ "rating.count": -1 })
    .skip(page * limit)
    .limit(limit)
    .lean()
    .exec()
    return nearbyStores;
  }
}
