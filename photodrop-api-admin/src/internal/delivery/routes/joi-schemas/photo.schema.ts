import Joi from 'joi';

const photoSchema = Joi.object({
  path: Joi.string().required(),
});

export const insertPhotosSchema = Joi.object({
  albumId: Joi.string().required(),
  photos: Joi.array().items(photoSchema),
});
