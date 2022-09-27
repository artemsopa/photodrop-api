import Joi from 'joi';

export const idReqSchema = Joi.object().keys({
  id: Joi.string().required(),
}).unknown(true);

export const getSignedUrlSchema = Joi.object({
  albumId: Joi.string().required(),
  contentType: Joi.string().required(),
});

export const keysSchema = Joi.object({
  albumId: Joi.string().required(),
  keys: Joi.array().items(Joi.string()).required(),
});
