import { useEffect, useRef } from "react";

export function CandlestickBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf = 0;

    const cols = Math.ceil(width / 40) + 4;

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // subtle dim overlay
      ctx.fillStyle = "rgba(6,6,6,0.22)";
      ctx.fillRect(0, 0, width, height);

      // draw multiple candlesticks scrolling from right to left
      const now = Date.now() / 1000;
      for (let i = 0; i < cols; i++) {
        const x = (i * 40 + ((now * 40) % 40)) - 40;
        const baseY = height * 0.6 + Math.sin((i + now) * 0.6) * 40;
        const open = baseY + rand(-30, 30);
        const close = baseY + rand(-30, 30);
        const high = Math.min(open, close) - rand(2, 24);
        const low = Math.max(open, close) + rand(2, 24);

        const isGreen = close <= open;
        const color = isGreen ? "rgba(0,255,150,0.95)" : "rgba(255,60,80,0.95)";
        const wickColor = isGreen ? "rgba(0,255,150,0.6)" : "rgba(255,60,80,0.6)";

        // wick
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + 20, high);
        ctx.lineTo(x + 20, low);
        ctx.stroke();

        // body
        const bodyTop = Math.min(open, close);
        const bodyHeight = Math.max(2, Math.abs(close - open));
        ctx.fillStyle = color;
        ctx.fillRect(x + 6, bodyTop, 28, bodyHeight);

        // glow
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fillRect(x + 6, bodyTop, 28, bodyHeight);
        ctx.shadowBlur = 0;
      }
    }

    function onResize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onResize);

    (function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 w-full h-full -z-10 opacity-60"
      aria-hidden
    />
  );
}
