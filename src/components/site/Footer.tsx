import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Send, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-primary/20 glass">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 gradient-green clip-corner grid place-items-center font-display font-bold text-primary-foreground">I</div>
            <span className="font-display font-bold">IMBUSI <span className="text-primary">FX</span></span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Elite forex education and mentorship by David Kangwe Sheehama.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-primary">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
            <li><Link to="/news" className="text-muted-foreground hover:text-primary">News & Updates</Link></li>
            <li><Link to="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-primary">Connect</h4>
          <div className="flex gap-3">
            {[
              { Icon: MessageCircle, href: "https://wa.me/264000000000" },
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Send, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center border border-primary/30 clip-corner text-primary hover:bg-primary hover:text-primary-foreground transition box-glow-sm"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Imbusi Forex Trading — David Kangwe Sheehama. All rights reserved.
      </div>
    </footer>
  );
}
