import argon2 from 'argon2';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createManagedUser = asyncHandler(async (request, response) => {
  const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const fullName = typeof request.body.fullName === 'string' ? request.body.fullName.trim() : '';
  const password = typeof request.body.password === 'string' ? request.body.password : '';
  const role = request.body.role;
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || fullName.length < 2 || fullName.length > 120
    || password.length < 12 || password.length > 128
    || !['owner', 'user'].includes(role)
  ) {
    return response.status(400).json({ error: 'Enter valid account details. Passwords must be at least 12 characters.' });
  }
  try {
    const user = await User.create({
      email,
      fullName,
      passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      role,
    });
    return response.status(201).json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ error: 'An account with this email already exists.' });
    throw error;
  }
});
