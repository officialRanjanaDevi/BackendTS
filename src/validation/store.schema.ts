import Joi from "joi";
import { StoreStatus } from "../models/store.model";

const addressDetailsSchema = Joi.object({
  gpslocation: Joi.object({
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional()
  }).optional(),
  addressLine1: Joi.string().optional(),
  townORcity: Joi.string().optional(),
  pinCode: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional()
}).optional();

export const storeSchema = Joi.object({
  sellerId: Joi.string().required(),
  gstId: Joi.string().required(),
  storeName: Joi.string().required(),
  storeDescription: Joi.string().required(),
  images: Joi.array().items(
    Joi.object({
      filename: Joi.string().optional(),
      url: Joi.string().optional()
    })
  ),
  status: Joi.string()
    .valid(...Object.values(StoreStatus))
    .required(),
  categoryList: Joi.array().items(Joi.string()),
  rating: Joi.object({
    count: Joi.number().optional(),
    rating: Joi.string().optional()
  }),
  reviewCount: Joi.number().optional(),
  followers: Joi.object({
    count: Joi.number().optional(),
    followers: Joi.array().items(Joi.string()).optional()
  }),
  openingHours: Joi.object({
    open: Joi.string().optional(),
    close: Joi.string().optional()
  })
});

export const storeUpdate = Joi.object({
  sellerId: Joi.string().optional(),
  gstId: Joi.string().optional(),
  storeName: Joi.string().optional(),
  storeDescription: Joi.string().optional(),
  images: Joi.array().items(
    Joi.object({
      filename: Joi.string().optional(),
      url: Joi.string().optional()
    })
  ),
  status: Joi.string()
    .valid(...Object.values(StoreStatus))
    .optional(),
  categoryList: Joi.array().items(Joi.string().optional()),
  rating: Joi.object({
    count: Joi.number().optional(),
    rating: Joi.string().optional()
  }),
  reviewCount: Joi.number().optional(),
  followers: Joi.object({
    count: Joi.number().optional(),
    followers: Joi.array().items(Joi.string()).optional()
  }),
  openingHours: Joi.object({
    open: Joi.string().optional(),
    close: Joi.string().optional()
  })
});
