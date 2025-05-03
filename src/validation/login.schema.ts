import * as Joi from "joi";

export const login: any = Joi.object({
  email: Joi.string().min(1).presence("required"),
  password: Joi.string().min(8).required()
});

export const updatePassword: any = Joi.object({
  userId: Joi.string().min(1).presence("required"),
  old_password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required()
});

const orderCreateValidationSchema = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ),
  totalPrice: Joi.number().required(),
  shippingAddress: Joi.string().required(),
  orderDate: Joi.date().default(Date.now),
  status: Joi.string().valid("pending", "processing", "shipped", "delivered").default("pending")
});

const orderUpdateValidationSchema = Joi.object({
  userId: Joi.string().optional(),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().optional(),
      quantity: Joi.number().integer().min(1).optional()
    })
  ),
  totalPrice: Joi.number().optional(),
  shippingAddress: Joi.string().optional(),
  orderDate: Joi.date().optional(),
  status: Joi.string().valid("pending", "processing", "shipped", "delivered").optional()
});
