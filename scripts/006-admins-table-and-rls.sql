-- Admins table: email-based access control for Admin Panel
CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY without IF NOT EXISTS (Postgres doesn't support it).
-- Use a DO block to only create if not present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admins'
      AND policyname = 'Authenticated read admins'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated read admins"
             ON admins
             FOR SELECT
             USING (auth.role() = ''authenticated'')';
  END IF;
END
$$;

-- Helpful index (idempotent)
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins (email);

-- Usage:
-- 1) Apna admin email add karein:
-- INSERT INTO admins (email) VALUES ('your-admin@gmail.com');

-- 2) Supabase Auth me isi email ke liye password set/change karein (Dashboard se).
-- Frontend bas yeh check karega:
-- - Logged-in user ka email admins table me hai ya nahi (SELECT allowed via policy).
