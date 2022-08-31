import Joi from 'joi';
import ApiError from '../../../domain/error';

const validateSchema = (schema: Joi.Schema, ctx: any) => {
  const { error, value } = schema.validate(ctx, { abortEarly: false });
  if (error) throw new ApiError(400, `Bad Request! ${error.details[0].message}`);
  return value;
};

export default validateSchema;
