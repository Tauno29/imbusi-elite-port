import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#strategy", label: "Strategy" },
  { href: "#community", label: "Community" },
  { href: "#contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 gradient-green clip-corner box-glow-sm grid place-items-center font-display font-bold text-primary-foreground">
            I
          </div>
          <span className="font-display font-bold tracking-tight text-sm sm:text-base">
            IMBUZI <span className="text-primary text-glow">FOREX</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-xs uppercase tracking-wider font-medium text-muted-foreground transition hover:text-primary hover:text-glow"
            >
              {l.label}
            </a>
          ))}
          <a
href="https://wa.me/264814368137?text=Hi%20David%2C%20I'm%20interested%20in%20your%20forex%20mentorship."
            target="_blank"
            rel="noreferrer"
            className="ml-3 inline-flex items-center gap-2 gradient-green text-primary-foreground font-bold uppercase tracking-wider text-xs px-4 py-2 clip-corner box-glow-sm hover:scale-105 transition"
          >
            Join Community
          </a>
        </nav>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-primary/20 px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm uppercase tracking-wider font-medium text-muted-foreground rounded-sm hover:bg-secondary hover:text-primary"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/264814368137?text=Hi%20David%2C%20I'm%20interested%20in%20your%20forex%20mentorship."
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 gradient-green text-primary-foreground font-bold uppercase tracking-wider text-xs px-4 py-3 clip-corner box-glow-sm"
          >
            Join Community
          </a>
        </div>
      )}
    </header>
  );
}

