import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Upload, Trash2, ImagePlus, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Imbuzi FX" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading, userId } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !userId) {
      toast.error("Please sign in via the admin button.");
      navigate({ to: "/" });
    } else if (!loading && userId && !isAdmin) {
      toast.error("You do not have admin access.");
      navigate({ to: "/" });
    }
  }, [loading, userId, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 gradient-green clip-corner grid place-items-center box-glow-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Imbuzi Forex Trading Control Center</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="glass mb-6 flex-wrap h-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="about">About Text</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileManager /></TabsContent>
          <TabsContent value="about"><AboutManager /></TabsContent>
          <TabsContent value="posts"><PostsManager /></TabsContent>
          <TabsContent value="gallery"><GalleryManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileManager() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });

  const current = data?.profile_image;

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `profile-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("profile").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("profile").getPublicUrl(path);
      await supabase.from("site_content").upsert({ key: "profile_image", value: pub.publicUrl, updated_at: new Date().toISOString() });
      toast.success("Profile picture updated.");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass clip-corner p-6">
      <h2 className="font-display text-xl mb-4">Profile Picture</h2>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {current ? (
          <img src={current} alt="" className="h-40 w-40 object-cover clip-corner border border-primary/30" />
        ) : (
          <div className="h-40 w-40 glass clip-corner grid place-items-center text-muted-foreground text-xs">No image</div>
        )}
        <div className="flex-1 space-y-3">
          <Label htmlFor="pf">Upload new photo</Label>
          <Input
            id="pf"
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {current && (
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.from("site_content").upsert({ key: "profile_image", value: "", updated_at: new Date().toISOString() });
                qc.invalidateQueries({ queryKey: ["site_content"] });
                toast.success("Removed.");
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- About ---------- */
function AboutManager() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });
  const [text, setText] = useState("");
  useEffect(() => { if (data?.about_text) setText(data.about_text); }, [data]);

  return (
    <div className="glass clip-corner p-6 space-y-4">
      <h2 className="font-display text-xl">About Section</h2>
      <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        className="gradient-green text-primary-foreground"
        onClick={async () => {
          await supabase.from("site_content").upsert({ key: "about_text", value: text, updated_at: new Date().toISOString() });
          qc.invalidateQueries({ queryKey: ["site_content"] });
          toast.success("About updated.");
        }}
      >
        <Save className="h-4 w-4 mr-2" /> Save
      </Button>
    </div>
  );
}

/* ---------- Posts ---------- */
function PostsManager() {
  const qc = useQueryClient();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["admin_posts"],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = async () => {
    if (!caption && !file) return toast.error("Add a caption or media.");
    setBusy(true);
    try {
      let url: string | null = null;
      let mediaType = "image";
      if (file) {
        if (file.size > 1024 * 1024 && file.type.startsWith("video")) {
          toast.error("Video must be under 1MB.");
          setBusy(false);
          return;
        }
        mediaType = file.type.startsWith("video") ? "video" : "image";
        const ext = file.name.split(".").pop();
        const path = `post-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("posts").upload(path, file);
        if (error) throw error;
        url = supabase.storage.from("posts").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("posts").insert({ caption, media_url: url, media_type: mediaType });
      if (error) throw error;
      toast.success("Post published.");
      setCaption(""); setFile(null);
      qc.invalidateQueries({ queryKey: ["admin_posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="space-y-6">
      <div className="glass clip-corner p-6 space-y-4">
        <h2 className="font-display text-xl">Create Post</h2>
        <Textarea placeholder="Caption / market analysis..." rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <p className="text-xs text-muted-foreground">Videos must be under 1MB.</p>
        <Button disabled={busy} onClick={create} className="gradient-green text-primary-foreground">
          {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Upload className="h-4 w-4 mr-2" /> Publish
        </Button>
      </div>

      <div className="glass clip-corner p-6">
        <h2 className="font-display text-xl mb-4">Existing Posts ({posts?.length ?? 0})</h2>
        <div className="space-y-3">
          {posts?.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-primary/15 p-3 clip-corner">
              {p.media_url && p.media_type === "image" && <img src={p.media_url} alt="" className="h-16 w-16 object-cover clip-corner" />}
              {p.media_url && p.media_type === "video" && <div className="h-16 w-16 grid place-items-center bg-secondary text-xs text-primary clip-corner">VIDEO</div>}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{p.caption || <em className="text-muted-foreground">No caption</em>}</p>
                <p className="text-xs text-muted-foreground">{p.likes_count} likes</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Gallery ---------- */
function GalleryManager() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: items } = useQuery({
    queryKey: ["admin_gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const upload = async () => {
    if (!file) return toast.error("Pick an image.");
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `gal-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file);
      if (error) throw error;
      const url = supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
      await supabase.from("gallery_items").insert({ title, image_url: url });
      toast.success("Added to gallery.");
      setTitle(""); setFile(null);
      qc.invalidateQueries({ queryKey: ["admin_gallery"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin_gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  };

  return (
    <div className="space-y-6">
      <div className="glass clip-corner p-6 space-y-4">
        <h2 className="font-display text-xl">Add to Gallery</h2>
        <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button disabled={busy} onClick={upload} className="gradient-green text-primary-foreground">
          {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <ImagePlus className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="glass clip-corner p-6">
        <h2 className="font-display text-xl mb-4">Gallery ({items?.length ?? 0})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items?.map((it) => (
            <div key={it.id} className="relative group clip-corner border border-primary/20">
              <img src={it.image_url} alt={it.title} className="aspect-square w-full object-cover" />
              <button
                onClick={() => del(it.id)}
                className="absolute top-2 right-2 h-8 w-8 grid place-items-center bg-destructive/90 text-destructive-foreground rounded-sm opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
