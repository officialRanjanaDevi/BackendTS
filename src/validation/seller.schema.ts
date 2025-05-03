import Joi from "joi";
import { level, roleType } from "../models/seller.model";

export const sellerSchema: any = Joi.object({
  access_level: Joi.string()
    .valid(...Object.values(level))
    .required(),
  role: Joi.string()
    .valid(...Object.values(roleType))
    .required(),
  phone_number: Joi.string().optional(),
  email: Joi.string().optional(),
  name: Joi.string().optional(),
  password: Joi.string().optional(),
  profilePic: Joi.string().optional(),
  gstId: Joi.string().required(),
  status: Joi.string().valid("active", "inactive").default("active").optional(),
  language: Joi.array().items(Joi.string()).optional(),
  document: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional()
});

export const sellerUpdateSchema: any = Joi.object({
  access_level: Joi.string()
    .valid(...Object.values(level))
    .required(),
  role: Joi.string()
    .valid(...Object.values(roleType))
    .required(),
  phone_number: Joi.string().optional(),
  email: Joi.string().optional(),
  name: Joi.string().optional(),
  password: Joi.string().optional(),
  profilePic: Joi.string().optional(),
  language: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  document: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional()
});
