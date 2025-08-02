-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  rating TEXT NOT NULL,
  duration TEXT NOT NULL,
  genre TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  download_links JSONB NOT NULL DEFAULT '[]',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create join_links table
CREATE TABLE IF NOT EXISTS join_links (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default movies
INSERT INTO movies (title, year, rating, duration, genre, image_url, description, download_links, featured) VALUES
('Avengers: Endgame', '2019', '8.4', '181 min', ARRAY['Action', 'Adventure'], '/placeholder.svg?height=800&width=600&text=Avengers+Endgame', 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos'' actions and restore balance to the universe.', '[{"url": "https://example.com/download1"}, {"url": "https://example.com/download2"}, {"url": "https://example.com/download3"}]', true),
('Spider-Man: No Way Home', '2021', '8.2', '148 min', ARRAY['Action', 'Adventure'], '/placeholder.svg?height=800&width=600&text=Spider-Man+No+Way+Home', 'Spider-Man''s identity is revealed, and he asks Doctor Strange for help, but a spell goes wrong, opening the multiverse.', '[{"url": "https://example.com/spiderman1"}, {"url": "https://example.com/spiderman2"}]', true),
('The Batman', '2022', '7.8', '176 min', ARRAY['Action', 'Crime'], '/placeholder.svg?height=800&width=600&text=The+Batman', 'Batman ventures into Gotham City''s underworld when a sadistic killer leaves behind a trail of cryptic clues.', '[{"url": "https://example.com/batman1"}, {"url": "https://example.com/batman2"}, {"url": "https://example.com/batman3"}]', false),
('Top Gun: Maverick', '2022', '8.3', '130 min', ARRAY['Action', 'Drama'], '/placeholder.svg?height=800&width=600&text=Top+Gun+Maverick', 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a new generation of pilots.', '[{"url": "https://example.com/topgun1"}]', true),
('Black Panther: Wakanda Forever', '2022', '6.7', '161 min', ARRAY['Action', 'Adventure'], '/placeholder.svg?height=800&width=600&text=Black+Panther+Wakanda+Forever', 'The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T''Challa.', '[{"url": "https://example.com/blackpanther1"}, {"url": "https://example.com/blackpanther2"}]', true);

-- Insert default join links
INSERT INTO join_links (title, description, url) VALUES
('Join Our Telegram Channel', 'Get latest movie updates, exclusive content, and be the first to know about new releases. Join our community of movie lovers!', 'https://telegram.me/smartsaathi'),
('Follow Us on WhatsApp', 'Receive instant notifications about new movies, download links, and special offers directly on your WhatsApp.', 'https://whatsapp.com/channel/smartsaathi');

-- Enable Row Level Security (RLS)
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on join_links" ON join_links FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Allow authenticated users to manage movies" ON movies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage join_links" ON join_links FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_join_links_updated_at BEFORE UPDATE ON join_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
