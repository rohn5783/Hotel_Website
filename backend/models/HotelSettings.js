import mongoose from 'mongoose';
import { defaultHotel } from '../config/defaultHotel.js';

const hotelSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  hotelData: { type: mongoose.Schema.Types.Mixed, required: true, default: defaultHotel },
  hotelDataVersion: { type: Number },
  isKilled: { type: Boolean, default: false },
  killMessage: { type: String, default: 'Website access is temporarily unavailable.' },
}, { timestamps: true, versionKey: false });

export const HotelSettings = mongoose.models.HotelSettings
  || mongoose.model('HotelSettings', hotelSettingsSchema);

export async function getHotelSettings() {
  const settings = await HotelSettings.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main', hotelData: defaultHotel, hotelDataVersion: 2 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if ((settings.hotelDataVersion || 1) < 2) {
    const currentData = settings.hotelData || {};
    settings.hotelData = {
      ...currentData,
      name: defaultHotel.name,
      tagline: defaultHotel.tagline,
      subTagline: defaultHotel.subTagline,
      city: defaultHotel.city,
      address: defaultHotel.address,
      phone: defaultHotel.phone,
      whatsapp: defaultHotel.whatsapp,
      email: defaultHotel.email,
      nearbyAttractions: defaultHotel.nearbyAttractions,
      amenities: (currentData.amenities || defaultHotel.amenities).map((amenity) => (
        amenity.id === 'rooftop'
          ? { ...amenity, description: defaultHotel.amenities.find((item) => item.id === 'rooftop').description }
          : amenity
      )),
    };
    settings.hotelDataVersion = 2;
    await settings.save();
  }

  return settings;
}
