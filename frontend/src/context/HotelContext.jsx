import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { hotelConfig as initialHotelConfig } from '../data/hotelData';
import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';

const HotelContext = createContext(null);
const initialKillSwitch = {
  isKilled: false,
  reason: 'Website access has been temporarily suspended. Please contact the administrator.',
};

export function HotelProvider({ children }) {
  const { currentUser } = useAuth();
  const [hotelData, setHotelData] = useState(initialHotelConfig);
  const [killSwitch, setKillSwitch] = useState(initialKillSwitch);
  const [bookings, setBookings] = useState([]);
  const [ownerSummary, setOwnerSummary] = useState({
    totalBookings: 0,
    paymentsReceived: 0,
    paidBookings: 0,
    confirmedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadHotel = useCallback(async () => {
    try {
      const result = await apiRequest('/api/hotel');
      if (
        !result?.hotelData
        || !Array.isArray(result.hotelData.rooms)
        || typeof result.killSwitch?.isKilled !== 'boolean'
      ) {
        throw new Error('Hotel API returned an invalid settings response.');
      }
      setHotelData(result.hotelData);
      setKillSwitch({
        isKilled: result.killSwitch.isKilled,
        reason: typeof result.killSwitch.reason === 'string'
          ? result.killSwitch.reason
          : initialKillSwitch.reason,
      });
    } catch (error) {
      console.error('Could not load hotel settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    if (!currentUser) {
      setBookings([]);
      setOwnerSummary({ totalBookings: 0, paymentsReceived: 0, paidBookings: 0, confirmedBookings: 0 });
      return;
    }
    if (currentUser.role === 'owner') {
      setBookings([]);
      try {
        setOwnerSummary(await apiRequest('/api/owner/summary'));
      } catch (error) {
        console.error('Could not load owner booking summary:', error);
      }
      return;
    }
    if (currentUser.role === 'admin') {
      try {
        const [summary, result] = await Promise.all([
          apiRequest('/api/owner/summary'),
          apiRequest('/api/bookings'),
        ]);
        setOwnerSummary(summary);
        setBookings(result.bookings);
      } catch (error) {
        console.error('Could not load booking dashboard:', error);
        setBookings([]);
      }
      return;
    }
    try {
      const result = await apiRequest('/api/bookings');
      setBookings(result.bookings);
    } catch (error) {
      console.error('Could not load bookings:', error);
      setBookings([]);
    }
  }, [currentUser]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateHotelData = async (newData) => {
    const result = await apiRequest('/api/admin/hotel', {
      method: 'PUT',
      body: JSON.stringify({
        hotelData: newData,
        isKilled: killSwitch.isKilled,
        killMessage: killSwitch.reason,
      }),
    });
    setHotelData(result.hotelData);
  };

  const toggleKillSwitch = async (isKilled, reason = killSwitch.reason) => {
    const result = await apiRequest('/api/admin/hotel', {
      method: 'PUT',
      body: JSON.stringify({ hotelData, isKilled, killMessage: reason }),
    });
    setKillSwitch({ isKilled, reason });
    setHotelData(result.hotelData);
  };

  const addBooking = async (bookingDetails) => {
    const result = await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingDetails),
    });
    setBookings((current) => [result.booking, ...current]);
    return result.booking;
  };

  const updateBookingStatus = async (id, status) => {
    const result = await apiRequest(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setBookings((current) => current.map((booking) => (
      booking.id === id ? result.booking : booking
    )));
    await loadBookings();
  };

  const updateBookingPaymentStatus = async (id, paymentStatus) => {
    const result = await apiRequest(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
    setBookings((current) => current.map((booking) => (
      booking.id === id ? result.booking : booking
    )));
    await loadBookings();
  };

  const deleteBooking = async (id) => {
    await apiRequest(`/api/bookings/${encodeURIComponent(id)}`, { method: 'DELETE' });
    setBookings((current) => current.filter((booking) => booking.id !== id));
    await loadBookings();
  };

  return (
    <HotelContext.Provider value={{
      hotelData,
      updateHotelData,
      killSwitch,
      toggleKillSwitch,
      bookings,
      ownerSummary,
      loadBookings,
      addBooking,
      updateBookingStatus,
      updateBookingPaymentStatus,
      deleteBooking,
      loading,
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export const useHotel = () => useContext(HotelContext);
