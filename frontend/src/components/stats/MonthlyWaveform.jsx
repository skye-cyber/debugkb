import { useEffect, useRef } from "react";

function readPrimary() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const parts = raw.split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
    ? parts
    : [99, 102, 241];
}

export default function MonthlyWaveform({ data = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let t0 = performance.now();
    let primary = readPrimary();
    let paused = false;

    const obs = new MutationObserver(() => {
      primary = readPrimary();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    function resize() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      const elapsed = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      const pad = 24;
      const usableW = Math.max(1, W - pad * 2);
      const baseY = H - 26;
      const maxN = Math.max(...data.map((d) => d.n), 1);
      const ampScale = (H - 70) / maxN;

      const points = data.map((d, i) => ({
        x: pad + (i / (data.length - 1)) * usableW,
        y: baseY - d.n * ampScale,
        n: d.n,
        m: d.m,
      }));

      const [r, g, b] = primary;

      // Filled area under curve
      const grad = ctx.createLinearGradient(0, 0, 0, baseY);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.20)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.moveTo(points[0].x, baseY + 6);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const mx = (p0.x + p1.x) / 2;
        const breathe = prefersReduced ? 0 : Math.sin(elapsed * 0.9 + i) * 2;
        ctx.bezierCurveTo(mx, p0.y + breathe, mx, p1.y - breathe, p1.x, p1.y);
      }
      ctx.lineTo(points[points.length - 1].x, baseY + 6);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke the curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const mx = (p0.x + p1.x) / 2;
        const breathe = prefersReduced ? 0 : Math.sin(elapsed * 0.9 + i) * 2;
        ctx.bezierCurveTo(mx, p0.y + breathe, mx, p1.y - breathe, p1.x, p1.y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Baseline
      ctx.strokeStyle = "rgba(128,128,128,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, baseY + 0.5);
      ctx.lineTo(W - pad, baseY + 0.5);
      ctx.stroke();

      // Markers and labels
      ctx.font =
        "10px Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const isLast = i === points.length - 1;
        const pulse = prefersReduced
          ? 1
          : isLast
            ? 1 + Math.sin(elapsed * 2) * 0.2
            : 1;

        ctx.fillStyle = `rgba(${r},${g},${b},${isLast ? 1 : 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(${r},${g},${b},0.25)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgb(148, 163, 184)";
        ctx.fillText(String(p.n), p.x, p.y - 14);
      }

      if (!prefersReduced) raf = requestAnimationFrame(draw);
    }

    function onVisibility() {
      paused = document.hidden;
      if (paused) {
        cancelAnimationFrame(raf);
      } else if (!prefersReduced) {
        raf = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (prefersReduced) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      obs.disconnect();
    };
  }, [data]);

  return (
    <div>
      <div className="relative w-full h-[180px]">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="flex justify-between text-[10px] text-fg-muted px-1.5 mt-1.5">
        {data.map((d) => (
          <span key={d.m}>{d.m}</span>
        ))}
      </div>
    </div>
  );
}
