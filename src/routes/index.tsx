import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Brain,
  ShieldCheck,
  LineChart,
  Signal,
  GraduationCap,
  Users,
  Instagram,
  Mail,
  Phone,
  Zap,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import logo from "@/assets/imbuzi-logo.jpeg";
import about1 from "@/assets/about-1.jpeg";
import about2 from "@/assets/about-2.jpeg";
import about4 from "@/assets/about-4.jpeg";
import resultChart from "@/assets/result-chart.jpeg";
import resultAcct from "@/assets/result-1.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imbuzi Forex — Kangwe David Sheehama | Elite Forex Mentor" },
      { name: "description", content: "Master the markets with Imbuzi Forex. Real trading, real results. Mentorship, signals & strategy by Kangwe David Sheehama." },
      { property: "og:title", content: "Imbuzi Forex — Master The Markets" },
      { property: "og:description", content: "Elite forex mentorship, signals and strategy by Kangwe David Sheehama." },
      { property: "og:image", content: logo },
    ],
  }),
  component: Home,
});

const WHATSAPP = "https://wa.me/264814368137";
const INSTAGRAM = "https://instagram.com/imbuzi_the_trader_na";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-primary/40 clip-corner glass text-[10px] sm:text-xs uppercase tracking-[0.35em] text-primary">
      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
      {children}
    </div>
  );
}

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <SectionLabel>IMBUZI FOREX</SectionLabel>

          <div className="relative inline-block animate-float-up" style={{ animationDelay: "0.1s" }}>
            <div className="absolute -inset-6 gradient-green opacity-30 blur-3xl" />
            <div className="relative p-1 gradient-green clip-corner box-glow animate-pulse-glow">
              <img
                src={logo}
                alt="Imbuzi Forex logo"
                width={200}
                height={200}
                className="h-36 w-36 sm:h-44 sm:w-44 object-cover bg-white clip-corner"
              />
            </div>
          </div>

          <h1 className="mt-8 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] animate-float-up" style={{ animationDelay: "0.2s" }}>
            MASTER THE <span className="text-primary text-glow">MARKETS.</span>
            <br />
            TRADE WITH PRECISION.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto animate-float-up" style={{ animationDelay: "0.3s" }}>
            Real trading. Real results. No fake gurus, no borrowed lifestyles.
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-primary/80 animate-float-up" style={{ animationDelay: "0.4s" }}>
            Kangwe David Sheehama · Founder
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-float-up" style={{ animationDelay: "0.5s" }}>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 gradient-green text-primary-foreground font-bold uppercase tracking-wider text-sm px-7 py-3 clip-corner box-glow hover:scale-105 transition"
            >
              <MessageSquare className="h-4 w-4" /> Join WhatsApp
            </a>
            <a
              href="#results"
              className="inline-flex items-center gap-2 glass border border-primary/50 font-bold uppercase tracking-wider text-sm px-7 py-3 clip-corner hover:border-primary hover:text-primary transition"
            >
              View Results <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: "5+", v: "Years Trading" },
            { k: "1000+", v: "Traders Mentored" },
            { k: "85%", v: "Win Rate" },
            { k: "24/7", v: "Market Watch" },
          ].map((s, i) => (
            <div key={i} className="glass clip-corner boxy p-5 text-center hover:box-glow-sm hover:border-primary transition">
              <div className="font-display text-3xl font-bold text-primary text-glow">{s.k}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>About The Founder</SectionLabel>
            <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
              The mind behind <span className="text-primary text-glow">Imbuzi Forex</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">Kangwe David Sheehama</span> is a Namibian forex trader, mentor and market analyst. He founded Imbuzi Forex to give African traders a serious, no-hype path into the markets — built on discipline, risk management and real execution.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { Icon: TrendingUp, t: "Trader", d: "Years of disciplined execution across majors and metals." },
                { Icon: Target, t: "Analyst", d: "Reads structure, liquidity and momentum with precision." },
                { Icon: GraduationCap, t: "Educator", d: "Beginner to advanced training built for real conditions." },
                { Icon: Award, t: "Founder", d: "Building Imbuzi Forex into Africa's elite trading brand." },
              ].map(({ Icon, t, d }, i) => (
                <div key={i} className="glass clip-corner boxy p-4 hover:border-primary hover:box-glow-sm transition">
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden clip-corner border border-primary/30 row-span-2 group">
              <img src={about2} alt="Kangwe David Sheehama studying the markets" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs uppercase tracking-widest text-primary">Founder · Kangwe DSD</div>
            </div>
            <div className="relative overflow-hidden clip-corner border border-primary/30 aspect-square group">
              <img src={about4} alt="Imbuzi Forex brand poster" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden clip-corner border border-primary/30 aspect-square group">
              <img src={about1} alt="Forex trading with Imbuzi flyer" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-display text-3xl sm:text-5xl font-bold">Elite <span className="text-primary text-glow">Services</span></h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Everything you need to trade the markets with structure, edge and confidence.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon: GraduationCap, t: "Forex Mentorship", d: "1-on-1 and group mentorship from beginner to advanced.", price: "N$5000 in-person · N$1000 online" },
            { Icon: Signal, t: "Signal Service", d: "High-probability setups delivered to your device.", price: "N$200 monthly · N$500 lifetime" },
            { Icon: LineChart, t: "Market Analysis", d: "Daily and weekly breakdowns of major pairs & gold." },
            { Icon: ShieldCheck, t: "Risk Management", d: "Position sizing, stop placement and capital protection." },
            { Icon: Brain, t: "Trading Psychology", d: "Build the mindset of a disciplined, profitable trader." },
            { Icon: Zap, t: "Beginner → Advanced", d: "Full curriculum: structure, liquidity, execution, journaling." },
          ].map(({ Icon, t, d, price }, i) => (
            <div key={i} className="group relative glass clip-corner boxy p-6 hover:border-primary hover:box-glow-sm transition overflow-hidden">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/30 transition" />
              <div className="relative">
                <div className="h-11 w-11 gradient-green clip-corner grid place-items-center box-glow-sm mb-4">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                {price && <p className="mt-3 text-xs font-mono text-primary">{price}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <SectionLabel>Proof Of Work</SectionLabel>
          <h2 className="font-display text-3xl sm:text-5xl font-bold">Real <span className="text-primary text-glow">Results</span></h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Documented account growth and live market execution — no fake screenshots.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { k: "+82%", v: "Account Growth" },
            { k: "5,227", v: "USD Balance" },
            { k: "1:6", v: "Avg R:R" },
          ].map((s, i) => (
            <div key={i} className="glass clip-corner boxy p-6 text-center hover:box-glow-sm transition">
              <div className="font-display text-4xl font-black text-primary text-glow">{s.k}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="relative glass clip-corner boxy p-3 group overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <img src={resultChart} alt="XAUUSD live trade setup" className="relative h-full w-full object-contain max-h-[520px] mx-auto" />
            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-primary glass px-2 py-1 clip-corner">XAU/USD · H1</div>
          </div>
          <div className="relative glass clip-corner boxy p-3 group overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <img src={resultAcct} alt="Live forex account growth" className="relative h-full w-full object-contain max-h-[520px] mx-auto" />
            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-primary glass px-2 py-1 clip-corner">Live Account</div>
          </div>
        </div>
      </section>

      {/* STRATEGY */}
      <section id="strategy" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <SectionLabel>The Method</SectionLabel>
          <h2 className="font-display text-3xl sm:text-5xl font-bold">The Imbuzi <span className="text-primary text-glow">Philosophy</span></h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary to-transparent" />
          <div className="space-y-6">
            {[
              { n: "01", t: "Discipline", d: "The plan is the edge. Follow it without negotiation." },
              { n: "02", t: "Risk Management", d: "Protect capital first. Profits are a by-product of survival." },
              { n: "03", t: "Smart Entries", d: "Trade structure, not noise. Wait for confluence." },
              { n: "04", t: "Patience", d: "A-grade setups only. Do nothing until the market pays." },
              { n: "05", t: "Market Structure", d: "Read liquidity, order flow and momentum like a map." },
            ].map((s, i) => (
              <div key={i} className={`relative grid sm:grid-cols-2 gap-4 ${i % 2 ? "sm:[&>*:first-child]:order-2" : ""}`}>
                <div className="glass clip-corner boxy p-5 sm:ml-12 hover:border-primary hover:box-glow-sm transition">
                  <div className="font-mono text-xs text-primary">{s.n}</div>
                  <h3 className="font-display text-xl font-bold mt-1">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
                <div className="hidden sm:block" />
                <div className="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 h-3 w-3 bg-primary rounded-full box-glow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <SectionLabel>The Movement</SectionLabel>
          <h2 className="font-display text-3xl sm:text-5xl font-bold">Join The <span className="text-primary text-glow">Community</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="relative glass clip-corner boxy p-8 hover:border-primary hover:box-glow-sm transition group overflow-hidden">
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/30 transition" />
            <MessageSquare className="h-8 w-8 text-primary" />
            <h3 className="font-display text-2xl font-bold mt-4">WhatsApp Community</h3>
            <p className="text-sm text-muted-foreground mt-2">Daily signals, market briefings and direct mentor access.</p>
            <div className="mt-5 inline-flex items-center gap-2 text-primary text-sm font-semibold">Open chat <ArrowRight className="h-4 w-4" /></div>
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="relative glass clip-corner boxy p-8 hover:border-primary hover:box-glow-sm transition group overflow-hidden">
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/30 transition" />
            <Instagram className="h-8 w-8 text-primary" />
            <h3 className="font-display text-2xl font-bold mt-4">@imbuzi_the_trader_na</h3>
            <p className="text-sm text-muted-foreground mt-2">Daily trades, lifestyle and community wins on Instagram.</p>
            <div className="mt-5 inline-flex items-center gap-2 text-primary text-sm font-semibold">Follow now <ArrowRight className="h-4 w-4" /></div>
          </a>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { q: "I went from blowing accounts to consistent monthly profit. The risk rules changed everything.", a: "T. M." },
            { q: "Best mentorship in Namibia. Real trades, real charts, no hype.", a: "L. K." },
            { q: "The discipline framework alone is worth 10x what I paid. Thank you Imbuzi.", a: "S. N." },
          ].map((t, i) => (
            <div key={i} className="glass clip-corner boxy p-5 hover:border-primary transition">
              <Sparkles className="h-4 w-4 text-primary mb-3" />
              <p className="text-sm text-muted-foreground italic">"{t.q}"</p>
              <p className="mt-3 text-xs font-mono text-primary">— {t.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="text-center mb-10">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="font-display text-3xl sm:text-5xl font-bold">Let's <span className="text-primary text-glow">Connect</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            {[
              { Icon: Phone, title: "WhatsApp", value: "0814368137", href: WHATSAPP },
              { Icon: Mail, title: "Email", value: "kangwedavid@icloud.com", href: "mailto:kangwedavid@icloud.com" },
              { Icon: Instagram, title: "Instagram", value: "@imbuzi_the_trader_na", href: INSTAGRAM },
              { Icon: Users, title: "Based In", value: "Namibia · Trading Global Markets", href: "#" },
            ].map(({ Icon, title, value, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                className="glass clip-corner boxy p-5 group hover:border-primary hover:box-glow-sm transition flex items-center gap-4">
                <div className="h-12 w-12 gradient-green clip-corner grid place-items-center shrink-0 box-glow-sm">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</div>
                  <div className="text-base font-semibold mt-1 group-hover:text-primary transition">{value}</div>
                </div>
              </a>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = WHATSAPP; }}
            className="relative glass clip-corner boxy p-6 overflow-hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-primary">Name</label>
                <input className="mt-1 w-full bg-input/60 border border-primary/20 px-3 py-2 clip-corner outline-none focus:border-primary text-sm" placeholder="Your name" required />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-primary">Email</label>
                <input type="email" className="mt-1 w-full bg-input/60 border border-primary/20 px-3 py-2 clip-corner outline-none focus:border-primary text-sm" placeholder="you@email.com" required />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-primary">Message</label>
                <textarea rows={4} className="mt-1 w-full bg-input/60 border border-primary/20 px-3 py-2 clip-corner outline-none focus:border-primary text-sm resize-none" placeholder="I'd like to join the mentorship..." required />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 gradient-green text-primary-foreground font-bold uppercase tracking-wider text-sm py-3 clip-corner box-glow hover:scale-[1.02] transition">
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
