import serverless from 'serverless-http';
import { runApp } from './app/app';

// runApp();
const app = runApp();

export const handler = serverless(app);
