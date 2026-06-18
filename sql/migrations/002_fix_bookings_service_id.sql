-- Fix bookings.service_id type (must match services.id which is text, not uuid).
-- Run this in Supabase SQL Editor if schema.sql failed on the bookings foreign key.

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;

ALTER TABLE bookings
  ALTER COLUMN service_id TYPE text USING service_id::text;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_service_id_fkey
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
