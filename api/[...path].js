import serverless from 'serverless-http';
import app from '../backend/app.js';

const handler = serverless(app);

export default async function api(request, response) {
  return handler(request, response);
}
