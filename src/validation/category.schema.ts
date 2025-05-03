import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  parent: Joi.string().required().default(null)
});

const categoryCreateValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  parent: Joi.string().allow(null), // Allow null or string
  image: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  })
});

const categoryUpdateValidationSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  parent: Joi.string().allow(null), // Allow null or string
  image: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  })
});
