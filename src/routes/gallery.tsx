import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Imbusi Forex Trading" },
      { name: "description", content: "Trading setups, charts, branding, and success moments from Imbusi Forex Trading." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Visuals</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            The <span className="text-primary text-glow">Gallery</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Charts, setups, branding and moments.</p>
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !data?.length ? (
          <div className="glass clip-corner p-12 text-center text-muted-foreground">Gallery coming soon.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {data.map((item, i) => (
              <div
                key={item.id}
                className="mb-4 break-inside-avoid relative group overflow-hidden clip-corner border border-primary/20 hover:border-primary animate-float-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <img src={item.image_url} alt={item.title} loading="lazy" className="w-full transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-sm font-medium text-primary text-glow">{item.title}</p>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary group-hover:shadow-[inset_0_0_40px_oklch(0.82_0.27_145/0.5)] transition" />
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
