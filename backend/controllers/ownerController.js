import { Booking } from '../models/Booking.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOwnerSummary = asyncHandler(async (_request, response) => {
  const [summary = {}] = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        paymentsReceived: {
          $sum: {
            $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$grandTotal', 0],
          },
        },
        paidBookings: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] },
        },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'Confirmed (Pay at Hotel)'] }, 1, 0] },
        },
      },
    },
  ]);
  return response.json({
    totalBookings: summary.totalBookings || 0,
    paymentsReceived: summary.paymentsReceived || 0,
    paidBookings: summary.paidBookings || 0,
    confirmedBookings: summary.confirmedBookings || 0,
  });
});
