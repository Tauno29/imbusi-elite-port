
-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL DEFAULT '',
  media_url TEXT,
  media_type TEXT NOT NULL DEFAULT 'image',
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_admin_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts_admin_update" ON public.posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts_admin_delete" ON public.posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts_anon_update_likes" ON public.posts FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Post likes (anonymous via client-stored uuid)
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, visitor_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_public_read" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "likes_public_insert" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_public_delete" ON public.post_likes FOR DELETE USING (true);

-- Trigger to keep likes_count in sync
CREATE OR REPLACE FUNCTION public.sync_post_likes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER post_likes_count_trigger
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_post_likes();

-- Gallery
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "gallery_admin_all" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site content key/value
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_public_read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "content_admin_all" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (key, value) VALUES
  ('about_text', 'David Kangwe Sheehama, known in the markets as Imbusi Forex Trading, is a professional forex trader and mentor with a passion for empowering the next generation of traders. With years of disciplined market study, risk management mastery, and consistent execution, David has built a reputation for clarity, precision, and elite performance.'),
  ('profile_image', '');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile', 'profile', true),
  ('posts', 'posts', true),
  ('gallery', 'gallery', true);

CREATE POLICY "public_read_profile" ON storage.objects FOR SELECT USING (bucket_id = 'profile');
CREATE POLICY "admin_write_profile" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_profile" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_profile" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'profile' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public_read_posts" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "admin_write_posts" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'posts' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_posts" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'posts' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_posts" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'posts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public_read_gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "admin_write_gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin role to the first user (David) who signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
