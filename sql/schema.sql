-- Supabase schema for Huma Beauty Salon admin dashboard

-- services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2),
  category text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text,
  email text,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  service_title text,
  date date,
  time text,
  notes text,
  status text DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at timestamptz DEFAULT now()
);

-- messages table (contact us)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  subject text,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  rating int,
  comment text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  discount numeric(5,2),
  original_price numeric(10,2),
  image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- settings table (singleton row recommended)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_name text,
  logo_url text,
  phone text,
  email text,
  address text,
  instagram text,
  facebook text,
  hero_title text,
  hero_subtitle text,
  footer_text text,
  updated_at timestamptz DEFAULT now()
);

-- admin users (optional, Supabase Auth recommended)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
