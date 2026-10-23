import argon2 from 'argon2';
import { env } from '../config/env.js';
import { connectDB } from '../db/connect.js';
import { User } from '../models/User.js';

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const fullName = process.env.BOOTSTRAP_ADMIN_NAME?.trim();

if (!email || !password || !fullName) {
  throw new Error('Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD, and BOOTSTRAP_ADMIN_NAME before seeding.');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length === 0) {
  throw new Error('Use a valid admin email and a non-empty bootstrap password.');
}

try {
  await connectDB();
  if (await User.exists({ role: 'admin' })) {
    throw new Error('An admin already exists. Bootstrap is one-time and will not modify existing accounts.');
  }
  if (await User.exists({ email })) {
    throw new Error('This email already has an account. Choose another bootstrap email.');
  }

  await User.create({
    email,
    fullName,
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    role: 'admin',
  });
  console.log(`Initial admin account created for ${email}. Remove bootstrap credentials from the environment.`);
} finally {
  const mongoose = await import('mongoose');
  await mongoose.default.disconnect();
}
