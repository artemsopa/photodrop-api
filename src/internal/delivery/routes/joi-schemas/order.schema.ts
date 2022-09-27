import Joi from 'joi';

const orderSchema = Joi.object({
  photoId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const insertOrdersSchema = Joi.object({
  albumId: Joi.string().required(),
  orders: Joi.array().items(orderSchema),
});
