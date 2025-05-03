import { Document } from "mongoose";
import { Request as ExpressRequest } from "express";

export enum statusType {
  active = "active",
  inactive = "inactive"
}

export interface IBulkUpload extends ExpressRequest {
  file?: Express.Multer.File ;
}
export interface IProduct extends Document {
  gstId: string;
  storeId?: string;
  status: statusType;
  category?: string[];
  subcategory?: string[];
  productName: string;
  shortDescription: string;
  fullDescription?: string;
  price?: number;
  isDiscount?: boolean;
  discount?: number;
  inStock?: boolean;
  stock?: number;
  shippingCharge?: number;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  attributes?: string[];
  weight?: string;
  height?: string;
  length?: string;
  width?: string;
  dimensions?: string;
  publisher?: string;
  language?: string;
  dateAdded?: Date;
}

export interface IProductUpdate extends Document {
  status?: statusType;
  category?: string[];
  subcategory?: string[];
  productName?: string;

  shortDescription: string;
  fullDescription?: string;
  price?: number;
  isDiscount?: boolean;
  discount?: number;
  inStock?: boolean;
  stock?: number;
  shippingCharge?: number;
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  attributes?: string[];
  weight?: string;
  height?: string;
  length?: string;
  width?: string;
  dimensions?: string;
  publisher?: string;
  language?: string;
  dateAdded?: Date;
}
