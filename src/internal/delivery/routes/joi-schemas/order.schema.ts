import Joi from 'joi';

const instanceId = Joi.string().required();

const userOrder = Joi.object({
  photoId: Joi.string().required(),
  userIds: Joi.array().items(instanceId),
});

export const orderSchema = Joi.object({
  albumId: Joi.string().required(),
  orders: Joi.array().items(userOrder),
});
