import Joi from 'joi';

export const getSignedUrlSchema = Joi.object({
  albumId: Joi.string().required(),
  contentType: Joi.string().required(),
});

const photoKey = Joi.string().required();

export const insertPhotosSchema = Joi.object({
  albumId: Joi.string().required(),
  photos: Joi.array().items(photoKey),
});

export const idReqSchema = Joi.object().keys({
  id: Joi.string().required(),
}).unknown(true);
