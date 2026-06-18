-- Supabase schema for Huma Beauty Salon admin dashboard

-- services table (text id matches local JSON catalog ids)
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  price numeric(10,2),
  category text,
  subcategory text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- service category groups (shown on /services page)
CREATE TABLE IF NOT EXISTS makeup_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hair_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS facial_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nails_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mehndi_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS waxing_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  name text,
  phone text,
  email text,
  service_id text REFERENCES services(id) ON DELETE SET NULL,
  service_title text,
  service text,
  price text,
  sale_amount numeric(10,2),
  offer_title text,
  discount text,
  staff_id text,
  staff_name text,
  referral_code text,
  date date,
  time text,
  notes text,
  status text DEFAULT 'pending',
  source text DEFAULT 'online',
  read boolean DEFAULT false,
  confirmed_at timestamptz,
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

-- beauty academy courses
CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  slug text,
  title text NOT NULL,
  category text,
  duration text,
  fee numeric(10,2),
  discount numeric(5,2),
  seats int DEFAULT 0,
  description text,
  syllabus jsonb DEFAULT '[]'::jsonb,
  image_url text,
  badge text,
  sort_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- course admissions (online apply + payment proof)
CREATE TABLE IF NOT EXISTS admissions (
  id text PRIMARY KEY,
  student_name text,
  name text,
  phone text,
  email text,
  age text,
  city text,
  course_id text,
  course_title text,
  course_fee text,
  batch text,
  experience text,
  notes text,
  transaction_id text,
  payment_screenshot text,
  payment_method text,
  status text DEFAULT 'pending',
  read boolean DEFAULT false,
  source text DEFAULT 'online',
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  title text,
  slug text,
  excerpt text,
  content text,
  image_url text,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- team / stylists
CREATE TABLE IF NOT EXISTS staff (
  id text PRIMARY KEY,
  name text,
  role text,
  specialty text,
  bio text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- loyalty points (booking rewards)
CREATE TABLE IF NOT EXISTS loyalty (
  id text PRIMARY KEY,
  phone text NOT NULL,
  points int DEFAULT 0,
  visits int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_subcategory ON services(subcategory);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_phone ON loyalty(phone);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
