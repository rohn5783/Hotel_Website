import { Booking } from '../models/Booking.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOwnerSummary = asyncHandler(async (_request, response) => {
  const [summary = {}] = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $ne: ['$status', 'Cancelled'] }, '$grandTotal', 0],
          },
        },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'Confirmed (Pay at Hotel)'] }, 1, 0] },
        },
      },
    },
  ]);
  return response.json({
    totalBookings: summary.totalBookings || 0,
    totalRevenue: summary.totalRevenue || 0,
    confirmedBookings: summary.confirmedBookings || 0,
  });
});
