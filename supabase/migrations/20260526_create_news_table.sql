-- Migration: create news table, indexes, trigger, RLS and helper
-- Generated: 2026-05-26

-- 1) ensure uuid generator is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) news table
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  content text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3) indexes
CREATE INDEX IF NOT EXISTS news_published_at_idx ON public.news (published_at DESC);
CREATE INDEX IF NOT EXISTS news_tags_idx ON public.news USING GIN (tags);
CREATE INDEX IF NOT EXISTS news_images_idx ON public.news USING GIN (images);
CREATE INDEX IF NOT EXISTS news_search_idx ON public.news USING GIN (
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content,''))
);

-- 4) trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_updated_at ON public.news;
CREATE TRIGGER trg_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 5) publish helper
CREATE OR REPLACE FUNCTION public.publish_news(p_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.news
  SET is_published = true,
      published_at = COALESCE(published_at, now()),
      updated_at = now()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- 6) Row Level Security (RLS) for safe access via Supabase client
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- allow anonymous/public selects only for published rows
CREATE POLICY "Public select published" ON public.news
  FOR SELECT
  USING (is_published = true);

-- allow authenticated users to insert (author_id may be set to their uid)
CREATE POLICY "Authenticated insert" ON public.news
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND (author_id IS NULL OR author_id = auth.uid()));

-- allow authors to update their own posts
CREATE POLICY "Author update" ON public.news
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- allow authors to delete their own posts
CREATE POLICY "Author delete" ON public.news
  FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- 7) convenience view (optional)
CREATE OR REPLACE VIEW public.published_news AS
  SELECT * FROM public.news WHERE is_published = true;
