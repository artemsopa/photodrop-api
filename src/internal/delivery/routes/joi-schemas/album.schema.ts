import Joi from 'joi';

export const albumSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .required(),
  location: Joi.string()
    .required(),
  date: Joi.number()
    .required(),
});
