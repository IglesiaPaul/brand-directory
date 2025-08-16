# Brand Directory (MVP)

Minimal Next.js + Supabase starter (no styling).

## Environment variables (create `.env.local` for local dev and set the same in Netlify)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
HCAPTCHA_SECRET=your-hcaptcha-secret  # optional; function included but not wired into the form yet

## Supabase SQL (run in Supabase > SQL editor)
-- Enable extensions (safe to run multiple times)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Tables
create table if not exists brand_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  brand_name text,
  email text,
  website text,
  bio text,
  primary_hex text,
  secondary_hex text,
  slug text generated always as (lower(replace(coalesce(brand_name, ''), ' ', '-'))) stored
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  brand_name text,
  website text,
  bio text,
  primary_hex text,
  secondary_hex text,
  slug text unique
);

-- Note: RLS is OFF by default in Supabase (so inserts work). Turn it on later for production.

## Routes
/submit         # brand submission form
/               # directory list
/brand/[slug]   # brand detail page
/admin          # simple moderation
/print-catalog  # very basic printable list
