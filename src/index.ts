import serverless, { Handler } from 'serverless-http';
import app from './app/app';

export const handler: Handler = async (event, context) => serverless(await app)(event, context);
