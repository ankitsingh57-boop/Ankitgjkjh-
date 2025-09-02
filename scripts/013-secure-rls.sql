-- Secure RLS setup + ensure movie_downloads exists

-- 0) Ensure movie_downloads table exists to avoid policy errors
CREATE TABLE IF NOT EXISTS public.movie_downloads (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1) Enable RLS on all relevant tables (safe to run multiple times)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_downloads ENABLE ROW LEVEL SECURITY;

-- 2) Movies: public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='movies' AND policyname='Public read movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read movies" ON public.movies FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END
$$;

-- 3) Movies: authenticated manage (insert/update/delete)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='movies' AND policyname='Auth manage movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth manage movies" ON public.movies
             FOR ALL TO authenticated
             USING (true) WITH CHECK (true)';
  END IF;
END
$$;

-- 4) Join Links: public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='join_links' AND policyname='Public read join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read join_links" ON public.join_links FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END
$$;

-- 5) Join Links: authenticated manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='join_links' AND policyname='Auth manage join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth manage join_links" ON public.join_links
             FOR ALL TO authenticated
             USING (true) WITH CHECK (true)';
  END IF;
END
$$;

-- 6) Movie Downloads: public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Public read downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read downloads" ON public.movie_downloads FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END
$$;

-- 7) Movie Downloads: authenticated manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='movie_downloads' AND policyname='Auth manage downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth manage downloads" ON public.movie_downloads
             FOR ALL TO authenticated
             USING (true) WITH CHECK (true)';
  END IF;
END
$$;
