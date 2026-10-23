import { getHotelSettings } from '../models/HotelSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublicHotel = asyncHandler(async (_request, response) => {
  const settings = await getHotelSettings();
  return response.json({
    hotelData: settings.hotelData,
    killSwitch: { isKilled: settings.isKilled, reason: settings.killMessage },
  });
});

export const updateHotel = asyncHandler(async (request, response) => {
  const { hotelData, isKilled, killMessage } = request.body;
  if (!hotelData || typeof hotelData !== 'object' || !Array.isArray(hotelData.rooms)) {
    return response.status(400).json({ error: 'Hotel configuration is invalid.' });
  }
  if (hotelData.rooms.some((room) => (
    !room.id || !room.name || !Number.isFinite(Number(room.price)) || Number(room.price) < 0
  ))) {
    return response.status(400).json({ error: 'Each room must have a name, id, and valid non-negative price.' });
  }
  const settings = await getHotelSettings();
  settings.hotelData = hotelData;
  if (typeof isKilled === 'boolean') settings.isKilled = isKilled;
  if (typeof killMessage === 'string') settings.killMessage = killMessage.slice(0, 500);
  await settings.save();
  return response.json({ hotelData: settings.hotelData });
});
