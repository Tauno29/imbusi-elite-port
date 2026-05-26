import { TrendingUp, TrendingDown } from "lucide-react";

const pairs = [
  { sym: "EUR/USD", price: "1.0842", chg: 0.32 },
  { sym: "GBP/USD", price: "1.2614", chg: -0.18 },
  { sym: "USD/JPY", price: "151.27", chg: 0.46 },
  { sym: "XAU/USD", price: "2342.18", chg: 1.24 },
  { sym: "BTC/USD", price: "67,420", chg: 2.14 },
  { sym: "USD/ZAR", price: "18.42", chg: -0.27 },
  { sym: "AUD/USD", price: "0.6582", chg: 0.11 },
  { sym: "USD/NAD", price: "18.41", chg: -0.22 },
];

export function MarketTicker() {
  const items = [...pairs, ...pairs];
  return (
    <div className="border-y border-primary/20 bg-card/50 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {items.map((p, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-xs font-mono">
            <span className="text-muted-foreground">{p.sym}</span>
            <span className="text-foreground">{p.price}</span>
            <span className={`flex items-center gap-1 ${p.chg >= 0 ? "text-primary" : "text-destructive"}`}>
              {p.chg >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {p.chg >= 0 ? "+" : ""}{p.chg}%
            </span>
            <span className="text-primary/40">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
