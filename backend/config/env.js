import 'dotenv/config';

const port = Number(process.env.PORT || 5000);
const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid port number between 1 and 65535.');
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
  jwtExpiresIn: '2h',
  isProduction: process.env.NODE_ENV === 'production',
};

if (Buffer.byteLength(env.jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET must be at least 32 bytes.');
}
