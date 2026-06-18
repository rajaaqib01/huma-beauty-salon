-- Extend bookings for admin dashboard + online booking (run if you created bookings from older schema.sql)

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sale_amount numeric(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS offer_title text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS staff_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS staff_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source text DEFAULT 'online';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS read boolean DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

-- Fix service_id type if an older schema used uuid
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;
ALTER TABLE bookings
  ALTER COLUMN service_id TYPE text USING service_id::text;
ALTER TABLE bookings
  ADD CONSTRAINT bookings_service_id_fkey
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
