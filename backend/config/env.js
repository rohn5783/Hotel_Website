import 'dotenv/config';

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000',
  jwtExpiresIn: '2h',
  isProduction: process.env.NODE_ENV === 'production',
};

if (Buffer.byteLength(env.jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET must be at least 32 bytes.');
}
