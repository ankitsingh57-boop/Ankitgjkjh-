-- Movie Trailer URL (optional) column
ALTER TABLE movies
ADD COLUMN IF NOT EXISTS trailer_url TEXT;

-- Example (optional):
-- UPDATE movies SET trailer_url = 'https://youtu.be/VIDEO_ID' WHERE id = 123;
