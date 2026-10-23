import argon2 from 'argon2';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clearAuthCookie, setAuthCookie } from '../middleware/auth.js';

const userDto = (user) => ({
  id: user.id || user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  role: user.role,
});

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const signup = asyncHandler(async (request, response) => {
  const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const fullName = typeof request.body.fullName === 'string' ? request.body.fullName.trim() : '';
  const password = typeof request.body.password === 'string' ? request.body.password : '';
  if (!validEmail(email) || fullName.length < 2 || fullName.length > 120 || password.length === 0) {
    return response.status(400).json({
      error: 'Enter a valid email, a name of 2-120 characters, and a non-empty password.',
    });
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  try {
    const user = await User.create({ email, fullName, passwordHash, role: 'user' });
    setAuthCookie(response, user.id);
    return response.status(201).json({ user: userDto(user) });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'An account with this email already exists.' });
    throw error;
  }
});

export const login = asyncHandler(async (request, response) => {
  const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = typeof request.body.password === 'string' ? request.body.password : '';
  const expectedRole = request.body.role;
  if (
    !validEmail(email)
    || password.length === 0
    || (expectedRole !== undefined && !['admin', 'owner', 'user'].includes(expectedRole))
  ) {
    return response.status(401).json({ error: 'Email or password is incorrect.' });
  }
  const user = await User.findOne({ email }).select('+passwordHash');
  if (
    !user
    || !(await argon2.verify(user.passwordHash, password))
    || (expectedRole && user.role !== expectedRole)
  ) {
    return response.status(401).json({ error: 'Email or password is incorrect.' });
  }

  setAuthCookie(response, user.id);
  return response.json({ user: userDto(user) });
});

export const me = (request, response) => response.json({ user: userDto(request.authUser) });

export const logout = (_request, response) => {
  clearAuthCookie(response);
  return response.status(204).end();
};

export const changePassword = asyncHandler(async (request, response) => {
  const currentPassword = typeof request.body.currentPassword === 'string' ? request.body.currentPassword : '';
  const newPassword = typeof request.body.newPassword === 'string' ? request.body.newPassword : '';
  if (newPassword.length === 0) {
    return response.status(400).json({ error: 'New password must not be empty.' });
  }

  const user = await User.findById(request.authUser.id).select('+passwordHash');
  if (!user || !(await argon2.verify(user.passwordHash, currentPassword))) {
    return response.status(400).json({ error: 'Current password is incorrect.' });
  }
  user.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
  await user.save();
  clearAuthCookie(response);
  return response.json({ message: 'Password updated. Please sign in again.' });
});
