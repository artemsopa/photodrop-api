import Joi from 'joi';

const orderSchema = Joi.object({
  photoId: Joi.string().required(),
  users: Joi.array().items(Joi.string()),
});

export const insertOrdersSchema = Joi.object({
  albumId: Joi.string().required(),
  orders: Joi.array().items(orderSchema),
});
