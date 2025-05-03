import { Document, Types, Schema } from "mongoose";
import { StoreStatus } from "../models/store.model";
import { ICategoryDetails } from "./category.interface";

export interface IStoreCreate extends Document {
  sellerId: string;
  storeName: string;
  storeDescription?: string;
  pincode: string;
  address1: string;
  address2?: string;
  pickupPincode: string;
  pickupAddress: string;
  gstId: string;
  country: string;
  state: string;
  district: string;
  status?: StoreStatus;
  addressDetails: {
    gpslocation?: {
      longitude?: string;
      latitude?: string;
    };
    addressLine1?: string;
    townORcity?: string;
    pinCode?: string;
    state?: string;
    country?: string;
  };
  categoryList?: (Schema.Types.ObjectId | ICategoryDetails)[];
}

export interface IStoreUpdate extends Document {
  openingHours?: any;
  status?: StoreStatus;
  addressDetails: {
    gpslocation?: {
      longitude?: string;
      latitude?: string;
    };
    addressLine1?: string;
    townORcity?: string;
    pinCode?: string;
    state?: string;
    country?: string;
  };
  categoryList?: (Schema.Types.ObjectId | ICategoryDetails)[];
}

// store.interface.ts

export interface IOfferCreate {
  title: string;
  description: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
}

export interface IOfferUpdate {
  title?: string;
  description?: string;
  discountPercentage?: number;
  startDate?: Date;
  endDate?: Date;
}
