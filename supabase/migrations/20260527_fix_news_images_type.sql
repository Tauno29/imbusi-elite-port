-- Migration: fix news.images type by dropping dependent view first
-- Generated: 2026-05-27

BEGIN;

-- Drop dependent view so we can alter the column type
DROP VIEW IF EXISTS public.published_news;

-- Convert images column to text[] (safely cast existing values)
ALTER TABLE public.news
  ALTER COLUMN images TYPE text[] USING images::text[];

-- Recreate convenience view
CREATE OR REPLACE VIEW public.published_news AS
  SELECT * FROM public.news WHERE is_published = true;

COMMIT;
