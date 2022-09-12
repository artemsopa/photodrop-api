import Joi from 'joi';

export const getSignedUrlSchema = Joi.object({
  albumId: Joi.string().required(),
  contentType: Joi.string().required(),
});

const photoSchema = Joi.object({
  key: Joi.string().required(),
  users: Joi.array().items(Joi.string().required()),
});

export const insertPhotosSchema = Joi.object({
  albumId: Joi.string().required(),
  photos: Joi.array().items(photoSchema),
});
