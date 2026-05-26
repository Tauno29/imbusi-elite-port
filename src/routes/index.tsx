import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MessageSquare, TrendingUp, Target, Award, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import profileFallback from "@/assets/profile-david.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imbuzi Forex Trading — David Kangwe Sheehama" },
      { name: "description", content: "Elite forex trader and mentor. Follow David Kangwe Sheehama's trading journey, market analysis and mentorship." },
      { property: "og:title", content: "Imbuzi Forex Trading" },
      { property: "og:description", content: "Elite forex trader and mentor — David Kangwe Sheehama" },
    ],
  }),
  component: Home,
});

function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("*");
      const map: Record<string, string> = {};
      data?.forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });
}

function Home() {
  const { data: content } = useSiteContent();
  const profileImg = content?.profile_image || profileFallback;
  const aboutText = content?.about_text || "";

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-primary/30 clip-corner glass text-xs uppercase tracking-[0.25em] text-primary animate-float-up">
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
            Live · Elite Forex Mentor
          </div>

          <div className="relative inline-block animate-float-up" style={{ animationDelay: "0.1s" }}>
            <div className="absolute -inset-4 gradient-green opacity-30 blur-2xl" />
            <div className="relative p-1 gradient-green clip-corner box-glow animate-pulse-glow">
              <img
                src={profileImg}
                alt="David Kangwe Sheehama"
                width={224}
                height={224}
                className="h-44 w-44 sm:h-56 sm:w-56 object-cover clip-corner"
              />
            </div>
          </div>

          <h1 className="mt-8 font-display text-5xl sm:text-7xl font-bold tracking-tight animate-float-up" style={{ animationDelay: "0.2s" }}>
            IMBUZI <span className="text-primary text-glow">FOREX</span> TRADING
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground font-mono animate-float-up" style={{ animationDelay: "0.3s" }}>
            David Kangwe Sheehama
          </p>
          <p className="mt-2 uppercase tracking-[0.4em] text-xs text-primary animate-float-up" style={{ animationDelay: "0.4s" }}>
            Forex Trader · Mentor · Strategist
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-float-up" style={{ animationDelay: "0.5s" }}>
            <Link
              to="/news"
              className="group inline-flex items-center gap-2 gradient-green text-primary-foreground font-semibold px-6 py-3 clip-corner box-glow hover:scale-105 transition"
            >
              View Updates <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 glass border border-primary/40 text-foreground font-semibold px-6 py-3 clip-corner hover:border-primary hover:text-primary transition"
            >
              <MessageSquare className="h-4 w-4" /> Contact
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-6 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: "5+", v: "Years Trading" },
            { k: "1000+", v: "Mentees" },
            { k: "85%", v: "Win Rate" },
            { k: "24/7", v: "Market Watch" },
          ].map((s, i) => (
            <div key={i} className="glass clip-corner p-5 text-center hover:box-glow-sm transition">
              <div className="font-display text-3xl font-bold text-primary text-glow">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4">About</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
              The mind behind <span className="text-primary text-glow">Imbuzi FX</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{aboutText}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { Icon: TrendingUp, t: "Experience", d: "Years of disciplined trading across major pairs and metals." },
                { Icon: Target, t: "Philosophy", d: "Risk first. Patience always. Execution without emotion." },
                { Icon: Award, t: "Success", d: "Consistent results documented through every market cycle." },
                { Icon: BookOpen, t: "Mentorship", d: "Sharing the blueprint with the next generation of traders." },
              ].map(({ Icon, t, d }, i) => (
                <div key={i} className="glass clip-corner p-4 hover:border-primary/50 hover:box-glow-sm transition">
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[g1, g2, g3, g4].map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden clip-corner border border-primary/20 hover:border-primary group ${
                  i === 0 ? "row-span-2 h-full" : "aspect-square"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition" />
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/60 group-hover:shadow-[inset_0_0_30px_oklch(0.82_0.27_145/0.4)] transition" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
