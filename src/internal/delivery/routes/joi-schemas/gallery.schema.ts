import Joi from 'joi';

export const idReqSchema = Joi.object().keys({
  id: Joi.string().required(),
}).unknown(true);
