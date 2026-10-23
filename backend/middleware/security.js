import { env } from '../config/env.js';

export function requireSameOrigin(request, response, next) {
  const origin = request.get('origin');
  if (!origin && env.isProduction) {
    return response.status(403).json({ error: 'Request origin is required.' });
  }
  if (!origin) return next();

  const allowed = new Set([env.appOrigin]);
  const forwardedHost = request.get('x-forwarded-host') || request.get('host');
  const forwardedProtocol = request.get('x-forwarded-proto')?.split(',')[0] || 'https';
  if (forwardedHost) allowed.add(`${forwardedProtocol}://${forwardedHost}`);
  if (!allowed.has(origin)) {
    return response.status(403).json({ error: 'Request origin is not allowed.' });
  }
  return next();
}
