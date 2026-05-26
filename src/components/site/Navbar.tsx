import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  // admin modal removed for portfolio-style site

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-primary/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 gradient-green clip-corner box-glow-sm grid place-items-center font-display font-bold text-primary-foreground">
              I
            </div>
            <span className="font-display font-bold tracking-tight text-sm sm:text-base">
              IMBUZI <span className="text-primary text-glow">FX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "text-primary text-glow" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {/* admin access removed from navbar for portfolio mode */}
          </nav>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden glass border-t border-primary/20 px-4 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-sm hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {/* admin access removed from mobile menu for portfolio mode */}
          </div>
        )}
      </header>

      {/* AdminModal removed */}
    </>
  );
}
