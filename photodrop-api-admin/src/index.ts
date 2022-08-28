import serverless from 'serverless-http';
import { runApp } from './app/app';

const app = runApp();

export const handler = serverless(app);
