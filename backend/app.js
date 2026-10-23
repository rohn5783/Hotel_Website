import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db/connect.js';
import { requireAuth } from './middleware/auth.js';
import { authorize } from './middleware/authorize.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireSameOrigin } from './middleware/security.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { signup, login, me, logout, changePassword } from './controllers/authController.js';
import { listBookings, createBooking, updateBooking, deleteBooking } from './controllers/bookingController.js';
import { getPublicHotel, updateHotel } from './controllers/hotelController.js';
import { getOwnerSummary } from './controllers/ownerController.js';
import { createManagedUser } from './controllers/adminController.js';

const app = express();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

app.use(asyncHandler(async (_request, _response, next) => {
  await connectDB();
  next();
}));

app.get('/api/hotel', getPublicHotel);
app.post('/api/auth/signup', authLimiter, requireSameOrigin, signup);
app.post('/api/auth/login', authLimiter, requireSameOrigin, login);
app.get('/api/auth/me', requireAuth, me);
app.post('/api/auth/logout', requireSameOrigin, logout);
app.post('/api/auth/change-password', requireAuth, requireSameOrigin, changePassword);

app.get('/api/bookings', requireAuth, authorize('admin', 'user'), listBookings);
app.post('/api/bookings', requireAuth, authorize('user'), requireSameOrigin, createBooking);
app.patch('/api/bookings/:id', requireAuth, authorize('admin'), requireSameOrigin, updateBooking);
app.delete('/api/bookings/:id', requireAuth, authorize('admin'), requireSameOrigin, deleteBooking);

app.get('/api/owner/summary', requireAuth, authorize('admin', 'owner'), getOwnerSummary);
app.post('/api/admin/users', requireAuth, authorize('admin'), requireSameOrigin, createManagedUser);
app.put('/api/admin/hotel', requireAuth, authorize('admin'), requireSameOrigin, updateHotel);

app.use((_request, response) => response.status(404).json({ error: 'API route not found.' }));
app.use(errorHandler);

export default app;
