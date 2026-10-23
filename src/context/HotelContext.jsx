import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { hotelConfig as initialHotelConfig } from '../data/hotelData';
import { supabase, isSupabaseConfigured, LOCAL_KEYS } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const HotelContext = createContext();

export function HotelProvider({ children }) {
  const { currentUser } = useAuth();
  const [hotelData, setHotelData] = useState(initialHotelConfig);
  const [killSwitch, setKillSwitch] = useState({
    isKilled: false,
    reason: 'Website access has been temporarily suspended due to pending commercial settlements. Please contact the agency administrator.',
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const bookingsRequest = useRef(0);

  useEffect(() => {
    loadHotelAndSettings();
  }, []);

  useEffect(() => {
    const requestId = ++bookingsRequest.current;
    if (isSupabaseConfigured && !currentUser?.id) {
      setBookings([]);
      return;
    }
    loadBookings(requestId);
  }, [currentUser?.id]);

  /**
   * Load Hotel Data & Kill Switch Settings
   */
  const loadHotelAndSettings = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global_config')
          .maybeSingle();

        if (error) throw error;
        if (data) {
          if (data.hotel_data) setHotelData(data.hotel_data);
          setKillSwitch({
            isKilled: Boolean(data.is_killed),
            reason: data.kill_message || killSwitch.reason,
          });
        }
      } else {
        // LocalStorage Dual-Mode
        const storedData = localStorage.getItem(LOCAL_KEYS.HOTEL_DATA);
        if (storedData) {
          try {
            setHotelData(JSON.parse(storedData));
          } catch (e) {
            console.error('Failed to parse local hotel data', e);
          }
        }

        const storedKill = localStorage.getItem(LOCAL_KEYS.KILL_SWITCH);
        if (storedKill) {
          try {
            setKillSwitch(JSON.parse(storedKill));
          } catch (e) {
            console.error('Failed to parse local kill switch', e);
          }
        }
      }
    } catch (err) {
      console.error('Error loading hotel data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load Bookings
   */
  const loadBookings = async (requestId) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (requestId !== bookingsRequest.current) return;
        setBookings((data || []).map((booking) => ({
          id: booking.id,
          bookingDate: booking.created_at
            ? new Date(booking.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            : '',
          roomName: booking.room_name,
          roomId: booking.room_id,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          nights: booking.nights,
          guestsCount: booking.guests_count,
          roomsCount: booking.rooms_count,
          guestName: booking.guest_name,
          guestPhone: booking.guest_phone,
          guestEmail: booking.guest_email,
          specialRequest: booking.special_request,
          arrivalTime: booking.arrival_time,
          subtotal: Number(booking.subtotal),
          taxes: Number(booking.taxes),
          grandTotal: Number(booking.grand_total),
          status: booking.status,
          paymentMode: booking.payment_mode,
        })));
      } else {
        const stored = JSON.parse(localStorage.getItem(LOCAL_KEYS.BOOKINGS) || '[]');
        if (stored.length === 0) {
          const initialDemos = [
            {
              id: 'RGH-JP-48201',
              bookingDate: 'Today, 11:30 AM',
              roomName: 'Executive Room',
              roomId: 'executive-room',
              checkIn: new Date().toISOString().split('T')[0],
              checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
              nights: 2,
              guestsCount: 2,
              roomsCount: 1,
              guestName: 'Vikramaditya Rathore',
              guestPhone: '+91 98290 87654',
              guestEmail: 'vikram.rathore@example.com',
              specialRequest: 'Late check-in requested (8 PM)',
              arrivalTime: '08:00 PM',
              subtotal: 4000,
              taxes: 480,
              grandTotal: 4480,
              status: 'Confirmed (Pay at Hotel)',
              paymentMode: 'UPI / Cash at Reception',
            },
            {
              id: 'RGH-JP-39145',
              bookingDate: 'Yesterday, 04:15 PM',
              roomName: 'Premium Room',
              roomId: 'premium-room',
              checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              checkOut: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
              nights: 3,
              guestsCount: 3,
              roomsCount: 1,
              guestName: 'Ananya Singhania',
              guestPhone: '+91 99102 33445',
              guestEmail: 'ananya.s@singhania.in',
              specialRequest: 'Palace view balcony room preferred',
              arrivalTime: '02:00 PM',
              subtotal: 9000,
              taxes: 1080,
              grandTotal: 10080,
              status: 'Confirmed (Pay at Hotel)',
              paymentMode: 'Card at Reception',
            }
          ];
          localStorage.setItem(LOCAL_KEYS.BOOKINGS, JSON.stringify(initialDemos));
          if (requestId === bookingsRequest.current) setBookings(initialDemos);
        } else {
          if (requestId === bookingsRequest.current) setBookings(stored);
        }
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    }
  };

  /**
   * Hotel Owner updates details (CMS)
   */
   const updateHotelData = async (newData) => {
     if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global_config',
          hotel_data: newData,
          is_killed: killSwitch.isKilled,
          kill_message: killSwitch.reason,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
    } else {
      localStorage.setItem(LOCAL_KEYS.HOTEL_DATA, JSON.stringify(newData));
    }
    setHotelData(newData);
  };

  /**
   * SuperAdmin Toggles Kill Switch
   */
  const toggleKillSwitch = async (isKilled, reason = killSwitch.reason) => {
    const updated = { isKilled, reason };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global_config',
          hotel_data: hotelData,
          is_killed: isKilled,
          kill_message: reason,
        });
      if (error) throw error;
    } else {
      localStorage.setItem(LOCAL_KEYS.KILL_SWITCH, JSON.stringify(updated));
    }
    setKillSwitch(updated);
  };

  /**
   * Add a new booking
   */
  const addBooking = async (newBooking) => {
    if (isSupabaseConfigured && supabase) {
      if (!currentUser?.id) {
        throw new Error('Sign in before creating a booking.');
      }
      const { error } = await supabase.from('bookings').insert({
        id: newBooking.id,
        user_id: currentUser.id,
        guest_name: newBooking.guestName,
        guest_phone: newBooking.guestPhone,
        guest_email: newBooking.guestEmail,
        room_id: newBooking.roomId,
        room_name: newBooking.roomName,
        check_in: newBooking.checkIn,
        check_out: newBooking.checkOut,
        nights: newBooking.nights,
        guests_count: newBooking.guestsCount,
        rooms_count: newBooking.roomsCount,
        special_request: newBooking.specialRequest,
        arrival_time: newBooking.arrivalTime,
        subtotal: newBooking.subtotal,
        taxes: newBooking.taxes,
        grand_total: newBooking.grandTotal,
        status: newBooking.status,
        payment_mode: newBooking.paymentMode,
      });
      if (error) throw error;
    }

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem(LOCAL_KEYS.BOOKINGS, JSON.stringify(updated));
  };

  /**
   * Delete a booking
   */
  const deleteBooking = async (id) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    }
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem(LOCAL_KEYS.BOOKINGS, JSON.stringify(updated));
  };

  return (
    <HotelContext.Provider
      value={{
        hotelData,
        updateHotelData,
        killSwitch,
        toggleKillSwitch,
        bookings,
        addBooking,
        deleteBooking,
        loading,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export const useHotel = () => useContext(HotelContext);
