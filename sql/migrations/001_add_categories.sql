-- Run in Supabase SQL Editor if you already created tables from an older schema.sql

ALTER TABLE services ADD COLUMN IF NOT EXISTS subcategory text;

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

CREATE INDEX IF NOT EXISTS idx_services_subcategory ON services(subcategory);
