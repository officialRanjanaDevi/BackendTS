import Joi from "joi";
import { addressType } from "../models/address.model";
import { addressStatus } from "../models/address.model";

export const addressSchema = Joi.object({
  refId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(addressType))
    .required(),
  status: Joi.string()
    .valid(...Object.values(addressStatus))
    .default(addressStatus.active),
  addressLine1: Joi.string().required(),
  townORcity: Joi.string().required(),
  pincode: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required()
});

export const updateAddressSchema = Joi.object({
  refId: Joi.string(),
  type: Joi.string().valid(...Object.values(addressType)),
  status: Joi.string().valid(...Object.values(addressStatus)),
  addressLine1: Joi.string(),
  townORcity: Joi.string(),
  pincode: Joi.string(),
  state: Joi.string(),
  country: Joi.string()
});
