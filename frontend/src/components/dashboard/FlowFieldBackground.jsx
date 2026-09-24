import { useEffect, useRef } from "react";

/**
 * Full-viewport ambient canvas.
 *
 * Particles are advected by a smooth vector field composed of layered
 * sine waves. The field drifts slowly over time, giving the background
 * a subtle, breathing motion that never repeats exactly.
 *
 * - Fixed behind content (z-index -10).
 * - Reads --color-primary so it adapts to light/dark theme.
 * - Pauses when the tab is hidden.
 * - Skips the animation loop entirely if prefers-reduced-motion is on.
 * - Radial mask softens the edges so it never competes with UI.
 */
export default function FlowFieldBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let width = 0;
        let height = 0;
        let raf = 0;
        let t = 0;
        let paused = false;
        let particles = [];

        function resize() {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.max(1, width * dpr);
            canvas.height = Math.max(1, height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const density = Math.floor((width * height) / 22000);
            particles = Array.from({ length: density }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: 0,
                vy: 0,
            }));
        }

        function field(x, y, time) {
            const a =
                Math.sin(x * 0.0035 + time * 0.00012) +
                Math.cos(y * 0.0028 - time * 0.00009);
            const b =
                Math.cos(x * 0.0021 - time * 0.00008) +
                Math.sin(y * 0.0033 + time * 0.00011);
            return [a * 0.7, b * 0.7];
        }

        function readPrimary() {
            const raw = getComputedStyle(document.documentElement)
                .getPropertyValue("--color-primary")
                .trim();
            const parts = raw.split(/\s+/).map(Number);
            return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
                ? parts
                : [99, 102, 241];
        }

        let primary = readPrimary();
        const themeObserver = new MutationObserver(() => {
            primary = readPrimary();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        function frame(now) {
            raf = requestAnimationFrame(frame);
            if (paused) return;
            t = now;

            ctx.clearRect(0, 0, width, height);

            const [r, g, b] = primary;

            for (const p of particles) {
                const [fx, fy] = field(p.x, p.y, t);
                p.vx = p.vx * 0.94 + fx * 0.06;
                p.vy = p.vy * 0.94 + fy * 0.06;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x += width;
                else if (p.x > width) p.x -= width;
                if (p.y < 0) p.y += height;
                else if (p.y > height) p.y -= height;

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.10)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function onVisibility() {
            paused = document.hidden;
        }

        resize();
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", onVisibility);
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", onVisibility);
            themeObserver.disconnect();
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
