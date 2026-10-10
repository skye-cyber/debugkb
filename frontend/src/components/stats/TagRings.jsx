import { useEffect, useRef } from "react";

const TAG_VAR = [
  "--primary",
  "--sev-high",
  "--sev-medium",
  "--st-workaround",
  "--sev-low",
];

function readColor(varName) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  const parts = raw.split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
    ? parts
    : [128, 128, 128];
}

export default function TagRings({ data = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let CX = 0;
    let CY = 0;
    let raf = 0;
    let paused = false;
    let colors = [];

    function readAll() {
      colors = data.map((_, i) => readColor(TAG_VAR[i % TAG_VAR.length]));
    }
    readAll();

    const obs = new MutationObserver(readAll);
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
      CX = W / 2;
      CY = H / 2;
    }

    function draw(now) {
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      const maxCount = Math.max(...data.map((d) => d.count), 1);
      const baseR = Math.min(W, H) * 0.16;
      const stepR = Math.min(W, H) * 0.055;

      // Center dot
      ctx.fillStyle = "rgba(128,128,128,0.4)";
      ctx.beginPath();
      ctx.arc(CX, CY, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.font =
        "10px 'Helvetica', 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
      ctx.textAlign = "left";

      for (let i = 0; i < data.length; i++) {
        const tag = data[i];
        const frac = tag.count / maxCount;
        const r = baseR + i * stepR;
        const breath = prefersReduced
          ? 1
          : 1 + Math.sin(t * (0.55 + i * 0.05) + i) * 0.02;
        const rr = r * breath;
        const [cr, cg, cb] = colors[i];

        const arcSpan = frac * Math.PI * 2;
        const phase = prefersReduced ? -Math.PI / 2 : t * (0.2 + i * 0.03);

        // Track
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.08)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(CX, CY, rr, 0, Math.PI * 2);
        ctx.stroke();

        // Active arc
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.85)`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(CX, CY, rr, phase, phase + arcSpan);
        ctx.stroke();

        // Label near the arc's end
        const labelAngle = phase + arcSpan + 0.15;
        const lx = CX + Math.cos(labelAngle) * (rr + 12);
        const ly = CY + Math.sin(labelAngle) * (rr + 12);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.95)`;
        ctx.fillText(tag.name, lx, ly);
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
    <div className="relative w-full h-[240px]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
