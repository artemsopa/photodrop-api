import { APIGatewayEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app/app';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverless(await app)(event, context);
};
