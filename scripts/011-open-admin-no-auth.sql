-- Open Admin (no-password) by allowing anon to manage data via RLS.
-- NOTE: This makes your database writable from the public website. Use with caution.

-- Movies
DO $$
BEGIN
  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movies' AND policyname = 'Public insert movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert movies" ON public.movies
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movies' AND policyname = 'Public update movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update movies" ON public.movies
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movies' AND policyname = 'Public delete movies'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete movies" ON public.movies
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;
END
$$;

-- Movie Downloads
DO $$
BEGIN
  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movie_downloads' AND policyname = 'Public insert downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert downloads" ON public.movie_downloads
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movie_downloads' AND policyname = 'Public update downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update downloads" ON public.movie_downloads
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'movie_downloads' AND policyname = 'Public delete downloads'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete downloads" ON public.movie_downloads
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;
END
$$;

-- Join Links
DO $$
BEGIN
  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'join_links' AND policyname = 'Public insert join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public insert join_links" ON public.join_links
             FOR INSERT TO anon, authenticated
             WITH CHECK (true)';
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'join_links' AND policyname = 'Public update join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public update join_links" ON public.join_links
             FOR UPDATE TO anon, authenticated
             USING (true) WITH CHECK (true)';
  END IF;

  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'join_links' AND policyname = 'Public delete join_links'
  ) THEN
    EXECUTE 'CREATE POLICY "Public delete join_links" ON public.join_links
             FOR DELETE TO anon, authenticated
             USING (true)';
  END IF;
END
$$;
