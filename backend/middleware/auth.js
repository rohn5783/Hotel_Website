import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

export const AUTH_COOKIE = 'hotel_session';

export function setAuthCookie(response, userId) {
  const token = jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    issuer: 'hotel-booking-api',
    audience: 'hotel-booking-web',
  });
  response.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(response) {
  response.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

export async function requireAuth(request, response, next) {
  const token = request.cookies?.[AUTH_COOKIE];
  if (!token) return response.status(401).json({ error: 'Please sign in.' });

  try {
    const payload = jwt.verify(token, env.jwtSecret, {
      issuer: 'hotel-booking-api',
      audience: 'hotel-booking-web',
    });
    const user = await User.findById(payload.sub).select('email fullName role');
    if (!user) return response.status(401).json({ error: 'Session is no longer valid.' });
    request.authUser = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      clearAuthCookie(response);
      return response.status(401).json({ error: 'Please sign in again.' });
    }
    return next(error);
  }
}
