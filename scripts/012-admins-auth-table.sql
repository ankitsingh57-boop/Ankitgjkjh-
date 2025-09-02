-- Admins table with hashed password + helpers (Supabase-compatible)
-- This lets you manage the admin Gmail/password directly from Supabase SQL.
-- IMPORTANT: For database writes in the Admin Panel, the session must be authenticated via Supabase Auth.
-- The panel will sign in with email/password and then check this admins table.

-- 1) Ensure pgcrypto (bcrypt) is installed in the 'extensions' schema (Supabase convention).
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2) Admins table: email + password_hash (bcrypt)
CREATE TABLE IF NOT EXISTS public.admins (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Enable RLS and allow only authenticated users to SELECT admins (frontend checks after login).
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admins' AND policyname = 'Authenticated read admins'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Authenticated read admins"
      ON public.admins
      FOR SELECT
      TO authenticated
      USING (true);
    $pol$;
  END IF;
END
$$;

-- 4) Helper: set or change admin password (bcrypt hash), idempotent upsert.
CREATE OR REPLACE FUNCTION public.admin_set_password(p_email TEXT, p_plain_password TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  INSERT INTO public.admins(email, password_hash)
  VALUES (p_email, extensions.crypt(p_plain_password, extensions.gen_salt('bf')))
  ON CONFLICT (email) DO UPDATE
  SET password_hash = extensions.crypt(p_plain_password, extensions.gen_salt('bf'));
END;
$$;

-- 5) Helper RPC: verify email/password against admins table (bcrypt).
CREATE OR REPLACE FUNCTION public.admin_verify(p_email TEXT, p_plain_password TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.email = p_email
      AND a.password_hash = extensions.crypt(p_plain_password, a.password_hash)
  );
$$;

-- 6) Seed a FAKE admin (EDIT LATER in Supabase).
-- Gmail: admin.fake@gmail.com
-- Password: Fake@12345
SELECT public.admin_set_password('admin.fake@gmail.com', 'Fake@12345');

-- How to change later:
-- SELECT public.admin_set_password('your-admin@gmail.com', 'YourNewStrongPassword@123');

-- NOTE:
-- - The Admin Panel will sign in via Supabase Auth using your email/password (not exposed in code),
--   and then authorize access by checking that your email exists in this admins table via RLS policy [^1].
-- - If the Auth user does not exist yet, the panel can create it automatically on first login (signUp),
--   or you can add it manually in Supabase Auth → Users.
