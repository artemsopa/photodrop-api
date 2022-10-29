import { ValidationError } from 'yup';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { ApiError } from '@/utils/ApiError';
import { Jwt } from '@/utils/Jwt';

export const okResponse = (statusCode: number, body :any) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const errorResponse = (error: any) => {
  const res = {
    statusCode: 500,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'Internal Server Error!' }),
  };
  if (error instanceof ApiError) {
    res.statusCode = error.status;
    res.body = JSON.stringify({ message: error.message });
  }
  if (error instanceof ValidationError) {
    res.statusCode = 400;
    res.body = JSON.stringify({ message: error.message });
  }
  return res;
};

export const getId = async (event: APIGatewayEvent, jwt: Jwt) => {
  const header = event.headers.authorization;
  if (!header) throw ApiError.unauthorized('Empty "Athorization" header');

  const parts = header.split(' ');
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
