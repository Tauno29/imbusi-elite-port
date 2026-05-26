-- Add about storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES
  ('about', 'about', true)
ON CONFLICT (id) DO NOTHING;

-- Add default about image entries to site_content
INSERT INTO public.site_content (key, value) VALUES
  ('about_image_1', ''),
  ('about_image_2', ''),
  ('about_image_3', ''),
  ('about_image_4', '')
ON CONFLICT (key) DO NOTHING;
