import Joi from 'joi';

export const getSignedUrlSchema = Joi.object({
  albumId: Joi.string().required(),
  contentType: Joi.string().required(),
});

const photoPath = Joi.string().required();

export const insertPhotosSchema = Joi.object({
  albumId: Joi.string().required(),
  photos: Joi.array().items(photoPath),
});
