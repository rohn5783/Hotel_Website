import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { getHotelSettings } from '../models/HotelSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const serializeBooking = (booking) => ({
  id: booking.id || booking._id.toString(),
  bookingDate: booking.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  roomName: booking.roomName,
  roomId: booking.roomId,
  checkIn: booking.checkIn.toISOString().slice(0, 10),
  checkOut: booking.checkOut.toISOString().slice(0, 10),
  nights: booking.nights,
  guestsCount: booking.guestsCount,
  roomsCount: booking.roomsCount,
  guestName: booking.guestName,
  guestPhone: booking.guestPhone,
  guestEmail: booking.guestEmail,
  specialRequest: booking.specialRequest,
  arrivalTime: booking.arrivalTime,
  subtotal: booking.subtotal,
  taxes: booking.taxes,
  grandTotal: booking.grandTotal,
  status: booking.status,
  paymentMode: booking.paymentMode,
  paymentStatus: booking.paymentStatus || 'Pending',
});

const parseDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
};

export const listBookings = asyncHandler(async (request, response) => {
  const filter = request.authUser.role === 'admin' ? {} : { user: request.authUser.id };
  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  return response.json({ bookings: bookings.map(serializeBooking) });
});

export const createBooking = asyncHandler(async (request, response) => {
  const {
    roomId, checkIn: rawCheckIn, checkOut: rawCheckOut, guestsCount, roomsCount,
    guestName, guestPhone, guestEmail, specialRequest, arrivalTime,
  } = request.body;
  const checkIn = parseDate(rawCheckIn);
  const checkOut = parseDate(rawCheckOut);
  const guests = Number(guestsCount);
  const rooms = Number(roomsCount);
  const name = typeof guestName === 'string' ? guestName.trim() : '';
  const phone = typeof guestPhone === 'string' ? guestPhone.trim() : '';
  const email = typeof guestEmail === 'string' ? guestEmail.trim().toLowerCase() : '';
  if (
    !checkIn || !checkOut || checkOut <= checkIn
    || !Number.isInteger(guests) || guests < 1 || guests > 4
    || !Number.isInteger(rooms) || rooms < 1 || rooms > 3
    || name.length < 2 || name.length > 120
    || phone.length < 6 || phone.length > 40
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return response.status(400).json({ error: 'Booking details are invalid.' });
  }

  const settings = await getHotelSettings();
  const room = settings.hotelData.rooms.find((item) => item.id === roomId);
  if (!room) return response.status(400).json({ error: 'Selected room is not available.' });
  if (room.maxGuests && guests > room.maxGuests * rooms) {
    return response.status(400).json({ error: 'Selected room capacity is too low for this guest count.' });
  }

  const nights = (checkOut.getTime() - checkIn.getTime()) / 86400000;
  const subtotal = Number(room.price) * nights * rooms;
  const taxes = Math.round(subtotal * 0.12);
  const booking = await Booking.create({
    user: request.authUser.id,
    guestName: name,
    guestEmail: email,
    guestPhone: phone,
    roomId: room.id,
    roomName: room.name,
    checkIn,
    checkOut,
    nights,
    guestsCount: guests,
    roomsCount: rooms,
    specialRequest: typeof specialRequest === 'string' ? specialRequest.slice(0, 1000) : '',
    arrivalTime: typeof arrivalTime === 'string' ? arrivalTime.slice(0, 40) : '',
    subtotal,
    taxes,
    grandTotal: subtotal + taxes,
  });
  return response.status(201).json({ booking: serializeBooking(booking) });
});

export const updateBooking = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const allowedStatuses = ['Confirmed (Pay at Hotel)', 'Checked In', 'Completed', 'Cancelled'];
  const updates = {};
  if (!mongoose.isValidObjectId(id)) return response.status(400).json({ error: 'Booking id is invalid.' });
  if (request.body.status !== undefined) {
    if (!allowedStatuses.includes(request.body.status)) {
      return response.status(400).json({ error: 'Booking status is invalid.' });
    }
    updates.status = request.body.status;
  }
  if (request.body.paymentStatus !== undefined) {
    if (!['Pending', 'Paid'].includes(request.body.paymentStatus)) {
      return response.status(400).json({ error: 'Payment status is invalid.' });
    }
    updates.paymentStatus = request.body.paymentStatus;
  }
  if (Object.keys(updates).length === 0) {
    return response.status(400).json({ error: 'No booking updates were provided.' });
  }
  const booking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!booking) return response.status(404).json({ error: 'Booking not found.' });
  return response.json({ booking: serializeBooking(booking) });
});

export const deleteBooking = asyncHandler(async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Booking id is invalid.' });
  }
  const booking = await Booking.findByIdAndDelete(request.params.id);
  if (!booking) return response.status(404).json({ error: 'Booking not found.' });
  return response.status(204).end();
});
