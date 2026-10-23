import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/connect.js';

try {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Hotel API listening on port ${env.port}`);
  });
} catch (error) {
  console.error('Could not start the API server:', error);
  process.exitCode = 1;
}
