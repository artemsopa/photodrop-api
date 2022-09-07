import Joi from 'joi';

export const idSchema = Joi.object().keys({
  userId: Joi.string().required(),
}).unknown(true);

export const loginSchema = Joi.object({
  login: Joi.string()
    .min(4)
    .max(30)
    .lowercase()
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required(),
});

export const phoneSchema = Joi.object({
  phone: Joi.string().required(),
});

export const verifySchema = Joi.object({
  phone: Joi.string().required(),
  code: Joi.string().required(),
});
