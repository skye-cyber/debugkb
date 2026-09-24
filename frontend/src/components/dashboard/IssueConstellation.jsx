import { useEffect, useRef } from "react";

const SEVERITY_COLOR = {
  critical: [248, 113, 113],
  high:     [251, 146,  60],
  medium:   [250, 204,  21],
  low:      [ 74, 222, 128],
};

export default function IssueConstellation({ issues = [] }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ raf: 0, particles: [], hoverId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
    }

    function makeParticles() {
      state.particles = issues.map((it, i) => {
        const resolved = it.status === "resolved";
        const priority = it.knowledge_priority ?? 5;

        // Orbit radius: resolved issues orbit tighter, unresolved wider.
        const baseR = resolved ? 60 : 130;
        const jitter = (priority / 10) * 40;
        const r = baseR + jitter + (i % 5) * 6;

        const a = (i / issues.length) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 0.0004 + (10 - priority) * 0.00005;

        const [r_, g_, b_] =
          SEVERITY_COLOR[it.severity] ?? SEVERITY_COLOR.medium;

        return {
          id: it.id,
          angle: a,
          r,
          speed,
          size: 1.6 + priority * 0.35,
          color: [r_, g_, b_],
          phase: Math.random() * Math.PI * 2,
          // spring targets for hover highlighting
          cx: 0, cy: 0,
        };
      });
    }

    function frame(now) {
      state.raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);

      // Center anchor
      ctx.strokeStyle = "rgba(128,128,128,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of state.particles) {
        p.angle += p.speed;
        const wobble = Math.sin(now * 0.0006 + p.phase) * 4;
        const x = cx + Math.cos(p.angle) * (p.r + wobble);
        const y = cy + Math.sin(p.angle) * (p.r + wobble);

        const hovered = state.hoverId === p.id;
        const [r, g, b] = p.color;

        if (hovered) {
          // Draw a connecting line to the center
          ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        // Particle
        ctx.fillStyle = `rgba(${r},${g},${b},${hovered ? 0.95 : 0.55})`;
        ctx.beginPath();
        ctx.arc(x, y, hovered ? p.size + 1 : p.size, 0, Math.PI * 2);
        ctx.fill();

        // Halo when hovered
        if (hovered) {
          ctx.strokeStyle = `rgba(${r},${g},${b},0.25)`;
          ctx.beginPath();
          ctx.arc(x, y, p.size + 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    resize();
    makeParticles();

    window.addEventListener("resize", resize);
    state.raf = requestAnimationFrame(frame);

    // Listen for hover events emitted from the parent list
    const onHover = (e) => { state.hoverId = e.detail.id; };
    window.addEventListener("issue-hover", onHover);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("issue-hover", onHover);
    };
  }, [issues]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 -z-0 h-full w-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
