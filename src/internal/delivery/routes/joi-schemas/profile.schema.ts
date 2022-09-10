import Joi from 'joi';

export const changePhoneSchema = Joi.object({
  phone: Joi.string().required(),
  code: Joi.string().required(),
});

export const changeEmailSchema = Joi.object({
  email: Joi.string().required(),
});

export const changeFullNameSchema = Joi.object({
  fullName: Joi.string().required(),
});

export const getAvatarUrlSchema = Joi.object({
  contentType: Joi.string().required(),
});

export const changeAvatarSchema = Joi.object({
  key: Joi.string().required(),
});
