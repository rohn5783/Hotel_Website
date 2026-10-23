-- Run in Supabase Dashboard -> SQL Editor.
-- Existing elevated profile roles are preserved. Audit profiles.role before
-- relying on it, then explicitly promote only trusted admin accounts.

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
  is_google_linked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  is_killed BOOLEAN DEFAULT false,
  kill_message TEXT DEFAULT 'This website is temporarily suspended. Please contact the administrator.',
  hotel_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_hotel_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'superadmin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_hotel_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_hotel_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Backfill profiles for accounts created before the profile trigger existed.
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  id,
  COALESCE(email, ''),
  COALESCE(raw_user_meta_data ->> 'full_name', ''),
  'customer'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Policies are permissive by default, so remove every prior policy on these
-- tables before installing the restricted policy set.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'site_settings', 'bookings')
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  END LOOP;
END;
$$;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (is_google_linked) ON TABLE public.profiles TO authenticated;

CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own Google link status"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

REVOKE ALL ON TABLE public.site_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE public.site_settings TO authenticated;

CREATE POLICY "Anyone can read public hotel settings"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert hotel settings"
ON public.site_settings FOR INSERT TO authenticated
WITH CHECK ((SELECT public.is_hotel_admin()));

CREATE POLICY "Admins can update hotel settings"
ON public.site_settings FOR UPDATE TO authenticated
USING ((SELECT public.is_hotel_admin()))
WITH CHECK ((SELECT public.is_hotel_admin()));

REVOKE ALL ON TABLE public.bookings FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bookings TO authenticated;

CREATE POLICY "Users can read their own bookings and admins can read all"
ON public.bookings FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR (SELECT public.is_hotel_admin())
);

CREATE POLICY "Users can create bookings for themselves"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE TO authenticated
USING ((SELECT public.is_hotel_admin()))
WITH CHECK ((SELECT public.is_hotel_admin()));

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE TO authenticated
USING ((SELECT public.is_hotel_admin()));
