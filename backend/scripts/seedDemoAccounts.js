import argon2 from 'argon2';
import mongoose from 'mongoose';
import { connectDB } from '../db/connect.js';
import { User } from '../models/User.js';

const accounts = [
  {
    role: 'admin',
    email: process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase(),
    fullName: process.env.BOOTSTRAP_ADMIN_NAME?.trim(),
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  },
  {
    role: 'owner',
    email: process.env.BOOTSTRAP_OWNER_EMAIL?.trim().toLowerCase(),
    fullName: process.env.BOOTSTRAP_OWNER_NAME?.trim(),
    password: process.env.BOOTSTRAP_OWNER_PASSWORD,
  },
];
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');

for (const account of accounts) {
  if (
    !validEmail(account.email)
    || !account.fullName
    || account.fullName.length < 2
    || account.fullName.length > 120
    || !account.password
  ) {
    throw new Error(`Set valid BOOTSTRAP_${account.role.toUpperCase()}_EMAIL, _NAME, and _PASSWORD values. Passwords must be non-empty.`);
  }
}

if (accounts[0].email === accounts[1].email) {
  throw new Error('Admin and owner bootstrap accounts must use different email addresses.');
}

try {
  await connectDB();
  const existingAccount = await User.findOne({
    $or: [
      { role: { $in: ['admin', 'owner'] } },
      { email: { $in: accounts.map(({ email }) => email) } },
    ],
  }).select('email role');

  if (existingAccount) {
    throw new Error(`Cannot seed demo accounts: an admin/owner account or requested email already exists (${existingAccount.role}).`);
  }

  const users = await User.create(await Promise.all(accounts.map(async (account) => ({
    email: account.email,
    fullName: account.fullName,
    passwordHash: await argon2.hash(account.password, { type: argon2.argon2id }),
    role: account.role,
  }))));
  console.log(`Created demo ${users.map(({ role }) => role).join(' and ')} accounts.`);
} finally {
  await mongoose.disconnect();
}
