import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';

const imageSchema = Joi.object({
  fileName: Joi.string().required(),
  originalName: Joi.string().required(),
}).required();

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(2).max(30)
      .required(),
    image: imageSchema,
    category: Joi.string().trim().required(),
    description: Joi.string().allow(''),
    price: Joi.number().allow(null),
  }).required(),
}, {
  abortEarly: false,
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    total: Joi.number().required(),
    items: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .required(),
  }).required(),
}, {
  abortEarly: false,
});
