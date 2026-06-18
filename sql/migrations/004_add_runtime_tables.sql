-- Add tables for courses, admissions, blog, staff, loyalty (run if schema.sql was applied before this update)

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

CREATE TABLE IF NOT EXISTS loyalty (
  id text PRIMARY KEY,
  phone text NOT NULL,
  points int DEFAULT 0,
  visits int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admissions(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_phone ON loyalty(phone);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
