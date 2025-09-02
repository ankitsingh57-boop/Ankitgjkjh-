-- 0) Ensure pgcrypto exists for bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1) Admins table with hashed password (no Supabase Auth required)
CREATE TABLE IF NOT EXISTS public.admins (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keep RLS on admins; we won't allow direct SELECT from anon
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 2) Helper to set/change admin password (hash with bcrypt)
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

-- 3) RPC to verify email/password (usable from the client)
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

-- 4) Allow anon to execute the verification RPC
GRANT EXECUTE ON FUNCTION public.admin_verify(TEXT, TEXT) TO anon, authenticated;

-- 5) Open write policies to anon (since there is no Auth)
-- Ensure tables exist (movie_downloads may not exist on some projects)
CREATE TABLE IF NOT EXISTS public.movie_downloads (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_downloads ENABLE ROW LEVEL SECURITY;

-- Public read (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movies' AND policyname='Public read movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read movies" ON public.movies FOR SELECT TO anon, authenticated USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='join_links' AND policyname='Public read join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read join_links" ON public.join_links FOR SELECT TO anon, authenticated USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Public read downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read downloads" ON public.movie_downloads FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END $$;

-- Public manage (insert/update/delete) for movies, join_links, movie_downloads
DO $$
BEGIN
  -- Movies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movies' AND policyname='Public insert movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert movies" ON public.movies
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movies' AND policyname='Public update movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update movies" ON public.movies
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movies' AND policyname='Public delete movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete movies" ON public.movies
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;

  -- Join Links
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='join_links' AND policyname='Public insert join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert join_links" ON public.join_links
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='join_links' AND policyname='Public update join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update join_links" ON public.join_links
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='join_links' AND policyname='Public delete join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete join_links" ON public.join_links
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;

  -- Movie Downloads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Public insert downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert downloads" ON public.movie_downloads
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Public update downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update downloads" ON public.movie_downloads
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Public delete downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete downloads" ON public.movie_downloads
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;
END $$;

-- 6) Seed an admin (CHANGE THE EMAIL IF YOU WANT)
-- Gmail: admin@gmail.com
-- Password: ankit07
SELECT public.admin_set_password('admin@gmail.com', 'ankit07');
