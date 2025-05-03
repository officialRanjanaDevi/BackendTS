import * as Joi from "joi";

export enum ProductStatus {
  active = "active",
  inactive = "inactive"
}

export const productDetails = Joi.object({
  gstId: Joi.string().required(),
  storeId: Joi.string().optional(),
  categoryId: Joi.array().items(Joi.string().optional()).optional(),
  brandId: Joi.string().optional(),
  sellerId: Joi.string().optional(),
  productName: Joi.string().required(),
  shortDescription: Joi.string().required(),
  fullDescription: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  category: Joi.array().items(Joi.string().optional()).optional(),
  subcategory: Joi.array().items(Joi.string().optional()).optional(),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  manufacturer: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  isDiscount: Joi.boolean().optional().default(true),
  shippingCharge: Joi.number().min(0).optional().default(0),
  images: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional(),
  discount: Joi.number().optional().default(0),
  inStock: Joi.boolean().optional().default(true),
  stock: Joi.number().optional(),
  features: Joi.array().items(Joi.string().optional()).optional(),
  metaTitle: Joi.string().optional(),
  metaKeywords: Joi.array().items(Joi.string().optional()).optional(),
  metaDescription: Joi.string().optional(),
  rating: Joi.object({
    count: Joi.number().optional(),
    rating: Joi.string().optional()
  }).optional(),
  attributes: Joi.array().items(Joi.string().optional()).optional(),
  specifications: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      value: Joi.string()
    })
  ),
  weight: Joi.string().optional(),
  height: Joi.string().optional(),
  length: Joi.string().optional(),
  width: Joi.string().optional(),
  dimensions: Joi.string().optional(),
  publisher: Joi.string().optional(),
  language: Joi.string().optional()
});

export const productUpdate = Joi.object({
  categoryId: Joi.array().items(Joi.string().optional()).optional(),
  storeId: Joi.string().optional(),
  sellerId: Joi.string().optional(),
  brandId: Joi.string().optional(),
  productName: Joi.string().required(),
  shortDescription: Joi.string().required(),
  fullDescription: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  category: Joi.array().items(Joi.string().optional()).optional(),
  subcategory: Joi.array().items(Joi.string().optional()).optional(),
  tags: Joi.array().items(Joi.string().optional()).optional(),
  manufacturer: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  isDiscount: Joi.boolean().optional().default(true),
  shippingCharge: Joi.number().min(0).optional().default(0),
  images: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().optional(),
        url: Joi.string().optional()
      })
    )
    .optional(),
  discount: Joi.number().optional().default(0),
  inStock: Joi.boolean().optional().default(true),
  stock: Joi.number().optional(),
  features: Joi.array().items(Joi.string().optional()).optional(),
  metaTitle: Joi.string().optional(),
  metaKeywords: Joi.array().items(Joi.string().optional()).optional(),
  metaDescription: Joi.string().optional(),
  rating: Joi.object({
    count: Joi.number().optional(),
    rating: Joi.string().optional()
  }).optional(),
  attributes: Joi.array().items(Joi.string().optional()).optional(),
  specifications: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      value: Joi.string()
    })
  ),
  weight: Joi.string().optional(),
  height: Joi.string().optional(),
  length: Joi.string().optional(),
  width: Joi.string().optional(),
  dimensions: Joi.string().optional(),
  publisher: Joi.string().optional(),
  language: Joi.string().optional()
});
