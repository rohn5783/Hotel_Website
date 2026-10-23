import { createClient } from '@supabase/supabase-js';

// Read environment variables (configured via .env or Vercel dashboard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True if real Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Real client (or null if not yet configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
