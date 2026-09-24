import { useEffect, useRef } from "react";

export default function FlowFieldBackground() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ raf: 0, t: 0, paused: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const state = stateRef.current;
    let particles = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.floor((width * height) / 22000);
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        life: Math.random() * 400,
      }));
    }

    function field(x, y, t) {
      // Layered sines produce a smooth, non-looping vector field
      const a =
        Math.sin(x * 0.0035 + t * 0.00012) +
        Math.cos(y * 0.0028 - t * 0.00009);
      const b =
        Math.cos(x * 0.0021 - t * 0.00008) +
        Math.sin(y * 0.0033 + t * 0.00011);
      return [a * 0.7, b * 0.7];
    }

    function frame(now) {
      state.raf = requestAnimationFrame(frame);
      if (state.paused) return;
      state.t = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const [r, g, b] = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim()
        .split(" ")
        .map(Number);

      for (const p of particles) {
        const [fx, fy] = field(p.x, p.y, state.t);
        p.vx = p.vx * 0.94 + fx * 0.06;
        p.vy = p.vy * 0.94 + fy * 0.06;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.10)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function onVisibility() {
      state.paused = document.hidden;
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    state.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      style={{
        opacity: 0.55,
        maskImage:
          "radial-gradient(120% 90% at 50% 30%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 90% at 50% 30%, black 40%, transparent 100%)",
      }}
    />
  );
}
