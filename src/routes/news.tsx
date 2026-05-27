import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { getVisitorId } from "@/lib/visitor";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates — Imbuzi Forex Trading" },
      { name: "description", content: "Latest trading updates, wins, and market analysis from David Kangwe Sheehama." },
    ],
  }),
  component: News,
});

type Post = {
  id: string;
  caption: string;
  media_url: string | null;
  media_type: string;
  likes_count: number;
  created_at: string;
};

function News() {
  const qc = useQueryClient();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async (): Promise<Post[]> => {
      // Prefer the new `news` table (managed by the admin dashboard). Fall back to legacy `posts` table.
      const { data: newsData, error: newsErr } = await (supabase as any)
        .from("news")
        .select("id, summary, images, created_at, is_published, published_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!newsErr && newsData && newsData.length > 0) {
        return (newsData as any[])
          .filter((n) => n.is_published === true || n.is_published == null)
          .map((n) => ({
            id: n.id,
            caption: n.summary ?? n.content ?? "",
            media_url: Array.isArray(n.images) && n.images.length ? n.images[0] : null,
            media_type: (Array.isArray(n.images) && n.images.length && n.images[0].endsWith('.mp4')) ? 'video' : 'image',
            likes_count: 0,
            created_at: n.published_at ?? n.created_at,
          } as Post));
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  useEffect(() => {
    const vid = getVisitorId();
    supabase
      .from("post_likes")
      .select("post_id")
      .eq("visitor_id", vid)
      .then(({ data }) => {
        if (data) setLikedIds(new Set(data.map((d) => d.post_id)));
      });
  }, [posts?.length]);

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      const vid = getVisitorId();
      const liked = likedIds.has(postId);
      if (liked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("visitor_id", vid);
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, visitor_id: vid });
      }
      return { postId, liked };
    },
    onSuccess: ({ postId, liked }) => {
      setLikedIds((prev) => {
        const next = new Set(prev);
        liked ? next.delete(postId) : next.add(postId);
        return next;
      });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Feed</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            News & <span className="text-primary text-glow">Updates</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Trading wins, market reads, and mentorship moments.</p>
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !posts?.length ? (
          <div className="glass clip-corner p-12 text-center text-muted-foreground">
            No updates yet. Check back soon — Imbuzi is preparing fresh content.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((p, idx) => {
              const liked = likedIds.has(p.id);
              return (
                <article
                  key={p.id}
                  className="glass clip-corner overflow-hidden animate-float-up hover:box-glow-sm transition"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/10">
                    <div className="h-9 w-9 gradient-green clip-corner grid place-items-center text-xs font-bold text-primary-foreground">I</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Imbuzi FX</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  {p.media_url && (
                    <div className="relative bg-black">
                      {p.media_type === "video" ? (
                        <video src={p.media_url} controls className="w-full max-h-150 object-contain" />
                      ) : (
                        <img src={p.media_url} alt="" loading="lazy" className="w-full max-h-150 object-contain" />
                      )}
                    </div>
                  )}

                  {p.caption && <p className="px-5 pt-4 text-sm leading-relaxed whitespace-pre-wrap">{p.caption}</p>}

                  <div className="flex items-center gap-4 px-5 py-4">
                    <button
                      onClick={() => toggleLike.mutate(p.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition ${
                        liked ? "text-primary text-glow" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart className={`h-5 w-5 transition ${liked ? "fill-primary scale-110" : ""}`} />
                      <span className="tabular-nums">{p.likes_count}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
