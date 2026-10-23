import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  guestName: { type: String, required: true, trim: true, maxlength: 120 },
  guestEmail: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  guestPhone: { type: String, required: true, trim: true, maxlength: 40 },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights: { type: Number, required: true, min: 1 },
  guestsCount: { type: Number, required: true, min: 1, max: 4 },
  roomsCount: { type: Number, required: true, min: 1, max: 3 },
  specialRequest: { type: String, maxlength: 1000, default: '' },
  arrivalTime: { type: String, maxlength: 40, default: '' },
  subtotal: { type: Number, required: true, min: 0 },
  taxes: { type: Number, required: true, min: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Confirmed (Pay at Hotel)', 'Checked In', 'Completed', 'Cancelled'],
    default: 'Confirmed (Pay at Hotel)',
  },
  paymentMode: { type: String, default: 'Cash / UPI / Card at Reception' },
}, { timestamps: true, versionKey: false });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
