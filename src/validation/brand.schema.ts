const Joi = require("joi");

const brandCreateValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  logo: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  }),
  video: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  })
});

const brandUpdateValidationSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  logo: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  }),
  video: Joi.object({
    filename: Joi.string().optional(),
    url: Joi.string().optional()
  })
});

module.exports = {
  brandCreateValidationSchema,
  brandUpdateValidationSchema
};
