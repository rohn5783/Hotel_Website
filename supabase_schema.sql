-- ==============================================================================
-- HOTEL BOOKING PLATFORM - SUPABASE DATABASE SCHEMA
-- Copy and paste this script directly into Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. PROFILES / USERS TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
  is_google_linked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. SITE SETTINGS & HOTEL DATA (Includes Kill Switch & Owner Dynamic CMS Data)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  is_killed BOOLEAN DEFAULT false,
  kill_message TEXT DEFAULT 'This website is temporarily suspended. Please contact the administrator.',
  hotel_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins & SuperAdmins can update site settings" 
ON public.site_settings FOR UPDATE USING (true);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  guests_count INTEGER NOT NULL,
  rooms_count INTEGER DEFAULT 1,
  special_request TEXT,
  arrival_time TEXT,
  subtotal NUMERIC NOT NULL,
  taxes NUMERIC NOT NULL,
  grand_total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Confirmed (Pay at Hotel)',
  payment_mode TEXT DEFAULT 'Pay on Check-in (Cash / UPI / Card)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a booking" 
ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
