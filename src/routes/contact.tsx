import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Instagram, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Imbuzi Forex Trading" },
      { name: "description", content: "Get in touch with David Kangwe Sheehama for mentorship, collaborations, and inquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Get in touch</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            Let's <span className="text-primary text-glow">Connect</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Mentorship, partnerships, speaking opportunities — reach out directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { Icon: MessageCircle, title: "WhatsApp", value: "0814368137", href: "https://wa.me/264814368137" },
            { Icon: Mail, title: "Email", value: "kangwedavid@icloud.com", href: "mailto:kangwedavid@icloud.com" },
            { Icon: Instagram, title: "Instagram", value: "@imbuzi_the_trader_na", href: "#" },
            { Icon: MapPin, title: "Based in", value: "Namibia · Global", href: "#" },
          ].map(({ Icon, title, value, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="glass clip-corner p-6 group hover:border-primary hover:box-glow-sm transition flex items-start gap-4 animate-float-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="h-12 w-12 gradient-green clip-corner grid place-items-center shrink-0 box-glow-sm">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
                <div className="text-base font-semibold mt-1 group-hover:text-primary transition">{value}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
