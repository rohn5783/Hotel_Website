import mongoose from 'mongoose';
import { defaultHotel } from '../config/defaultHotel.js';

const hotelSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  hotelData: { type: mongoose.Schema.Types.Mixed, required: true, default: defaultHotel },
  isKilled: { type: Boolean, default: false },
  killMessage: { type: String, default: 'Website access is temporarily unavailable.' },
}, { timestamps: true, versionKey: false });

export const HotelSettings = mongoose.models.HotelSettings
  || mongoose.model('HotelSettings', hotelSettingsSchema);

export async function getHotelSettings() {
  return HotelSettings.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main', hotelData: defaultHotel } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}
