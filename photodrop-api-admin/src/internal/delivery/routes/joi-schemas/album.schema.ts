import Joi from 'joi';

export const albumSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .required(),
  icon: Joi.string()
    .required(),
  location: Joi.string()
    .required(),
});
