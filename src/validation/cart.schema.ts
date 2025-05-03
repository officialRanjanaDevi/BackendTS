import * as Joi from "joi";

export enum Level {
  one = "1",
  two = "2",
  three = "3"
}

export enum ProductCount {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5
}

export const cartCreation = Joi.object({
  customerId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().optional(),
        count: Joi.number().optional().default(1)
      })
    )
    .optional(),
  document: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional()
});

export const cartUpdate = Joi.object({
  customerId: Joi.string().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().optional(),
        count: Joi.number().optional().default(1)
      })
    )
    .optional(),
  document: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional()
});
