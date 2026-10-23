import { createClient } from '@supabase/supabase-js';

export let isSupabaseConfigured = false;
export let supabase = null;

export const supabaseReady = (async () => {
  const response = await fetch('/api/supabase-config');
  if (!response.ok) {
    throw new Error(`Could not load Supabase configuration (HTTP ${response.status}).`);
  }

  const { url = '', anonKey = '' } = await response.json();
  if (!url && !anonKey) return;
  if (!url || !anonKey || !url.startsWith('https://')) {
    throw new Error('Supabase configuration is incomplete or invalid.');
  }

  supabase = createClient(url, anonKey);
  isSupabaseConfigured = true;
})();

/**
 * Storage Keys for Local Dual-Mode Demo
 * When Supabase keys aren't added, everything seamlessly persists in LocalStorage
 * When Supabase keys are added, it syncs with Supabase Cloud Postgres!
 */
export const LOCAL_KEYS = {
  USERS: 'hotel_app_users_v2',
  CURRENT_SESSION: 'hotel_app_session_v2',
  HOTEL_DATA: 'hotel_app_data_v2',
  BOOKINGS: 'hotel_app_bookings_v2',
  KILL_SWITCH: 'hotel_app_kill_switch_v2',
};
