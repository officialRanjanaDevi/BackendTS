import mongoose, { Model, model, Schema } from "mongoose";
import Category from "./category.model";
import Seller from "./seller.model";
import User from "./user.model";

export enum StoreStatus {
  active = "active",
  inactive = "inactive"
}

export const storeDetails = new mongoose.Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: Seller, required: true },
  storeName: { type: String, required: true },
  storeDescription: { type: String },

  gstId: { type: String, required: true, unique: true },
  
  images: [
    {
      filename: { type: String, required: false },
      url: { type: String, required: false }
    }
  ],
  status: { type: String, required: true, enum: Object.values(StoreStatus), default: StoreStatus.active },

  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: Category
    }
  ],
  rating: {
    count: { type: Number, required: false },
    rating: { type: String, required: false }
  },
  reviewCount: { type: Number, required: false },
  followers: {
    count: { type: Number, required: false },
    followers: [{ type: Schema.Types.ObjectId, ref: User, required: false }]
  },
  openingHours: [
    {
      dayOfWeek: { type: String, required: false },
      openTime: { type: String, required: false },
      closeTime: { type: String, required: false }
    }
  ],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    },
  },
  offers: [
    {
      title: { type: String, required: false },
      description: { type: String, required: false },
      discountPercentage: { type: Number, required: false },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false }
    }
  ]
});

const Store: Model<any> = model<any>("store", storeDetails);
export default Store;
