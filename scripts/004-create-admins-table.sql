-- 3) Allowed admins list (email based). Isse aap supabase me email add/remove karke admin control karenge.
CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Sirf authenticated users padh sakte (frontend ko bas check karna hota hai)
CREATE POLICY IF NOT EXISTS "Authenticated read admins"
ON admins FOR SELECT USING (auth.role() = 'authenticated');

-- Admins manage karne ke liye aap Supabase SQL editor se entries insert/delete karein.
-- Example:
-- INSERT INTO admins (email) VALUES ('your-admin@gmail.com');
