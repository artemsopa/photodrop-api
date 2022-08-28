import Joi from 'joi';

export const Schema = Joi.object({
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
