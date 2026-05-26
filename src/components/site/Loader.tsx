import { useEffect, useState } from "react";

export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background">
      <div className="relative">
        <div className="h-20 w-20 gradient-green clip-corner grid place-items-center font-display font-bold text-3xl text-primary-foreground animate-pulse-glow">
          I
        </div>
        <div className="absolute inset-0 border border-primary animate-scan overflow-hidden" />
      </div>
      <p className="absolute bottom-1/3 font-display tracking-[0.4em] text-xs text-primary text-glow">
        IMBUSI FX
      </p>
    </div>
  );
}
