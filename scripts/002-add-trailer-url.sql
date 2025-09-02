-- 1) Movies table me trailer_url add
ALTER TABLE movies
ADD COLUMN IF NOT EXISTS trailer_url TEXT;
