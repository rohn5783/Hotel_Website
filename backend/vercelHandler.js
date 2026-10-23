import serverless from 'serverless-http';
import app from './app.js';

const handler = serverless(app);

export default function vercelHandler(request, response) {
  return handler(request, response);
}
