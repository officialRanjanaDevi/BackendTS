import * as Joi from "joi";

export const reviewCreation = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  reviewText: Joi.string().required(),
  pictures: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional(),
  likes: Joi.boolean().optional().default(false),
  dislikes: Joi.boolean().optional().default(false),
  rating: Joi.number().required(),
  status: Joi.string().valid("active", "inactive").default("active")
});

export const reviewUpdate = Joi.object({
  reviewText: Joi.string().required(),
  productId: Joi.string().required(),
  pictures: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional(),
  likes: Joi.boolean().optional().default(false),
  dislikes: Joi.boolean().optional().default(false),
  rating: Joi.number().required(),
  status: Joi.string().valid("active", "inactive").default("active")
});
