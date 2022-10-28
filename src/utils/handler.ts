import { ValidationError } from 'yup';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { ApiError } from '@/utils/ApiError';
import { Jwt } from '@/utils/Jwt';

export const okResponse = (statusCode: number, body :any) => ({
  statusCode,
  body: JSON.stringify(body, null, 2),
});

export const errorResponse = (error: any) => {
  const res = {
    statusCode: 500,
    body: JSON.stringify({ message: 'Internal Server Error!' }, null, 2),
  };
  if (error instanceof ApiError) {
    res.statusCode = error.status;
    res.body = JSON.stringify({ message: error.message }, null, 2);
  }
  if (error instanceof ValidationError) {
    res.statusCode = 400;
    res.body = JSON.stringify({ message: error.message }, null, 2);
  }
  return res;
};

export const getId = async (event: APIGatewayEvent, jwt: Jwt) => {
  const authorization = event.headers.Authorization;
  if (!authorization) throw ApiError.unauthorized('Empty "Athorization" header');

  const parts = authorization.split(' ');
  if (parts[0] !== 'Bearer' || !parts[1]) throw ApiError.unauthorized('Invalid "Authorization" header');

  const id = jwt.verifyToken(parts[1]);
  if (!id) throw ApiError.unauthorized('Invalid authorization token');

  return id;
};

export const wrapped = (callback: any) => async (event: APIGatewayEvent, context: Context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    return await callback(event);
  } catch (error) {
    console.log(error);
    return errorResponse(error);
  }
};
