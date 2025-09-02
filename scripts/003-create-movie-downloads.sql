-- 2) Download links ke liye separate table
CREATE TABLE IF NOT EXISTS movie_downloads (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enable
ALTER TABLE movie_downloads ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY IF NOT EXISTS "Public read downloads"
ON movie_downloads FOR SELECT USING (true);

-- Authenticated users can manage
CREATE POLICY IF NOT EXISTS "Auth manage downloads"
ON movie_downloads FOR ALL USING (auth.role() = 'authenticated');

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_movie_downloads_updated_at ON movie_downloads;
CREATE TRIGGER trg_movie_downloads_updated_at
BEFORE UPDATE ON movie_downloads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- OPTIONAL: Purane JSONB download_links ko migrate karna (agar column exist karta ho)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'movies' AND column_name = 'download_links'
  ) THEN
    INSERT INTO movie_downloads (movie_id, url, position)
    SELECT m.id,
           (elem->>'url')::text AS url,
           ord::smallint AS position
    FROM movies m
    CROSS JOIN LATERAL jsonb_array_elements(m.download_links) WITH ORDINALITY AS dl(elem, ord)
    WHERE jsonb_typeof(m.download_links) = 'array';
    
    -- JSONB column hata dena to avoid confusion
    ALTER TABLE movies DROP COLUMN IF EXISTS download_links;
  END IF;
END $$;
