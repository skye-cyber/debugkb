import { useRef, useEffect } from "react";

export default function ReactiveTitle({ children, className = "" }) {
    const ref = useRef(null);
    const stateRef = useRef({ w: 500, target: 500, raf: 0 });

    useEffect(() => {
        const el = ref.current;
        const state = stateRef.current;

        function onPointer(e) {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy);

            // Within 260px → weight ramps from 500 (default) to 800
            const t = Math.max(0, 1 - dist / 260);
            state.target = 500 + t * 300;
        }

        function tick() {
            state.raf = requestAnimationFrame(tick);
            state.w += (state.target - state.w) * 0.1;
            el.style.fontVariationSettings = `"wght" ${state.w.toFixed(1)}`;
        }

        window.addEventListener("pointermove", onPointer);
        state.raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(state.raf);
            window.removeEventListener("pointermove", onPointer);
        };
    }, []);

    return (
        <h1
            ref={ref}
            className={`text-xl font-semibold tracking-tight ${className}`}
            style={{ fontVariationSettings: '"wght" 500' }}
        >
            {children}
        </h1>
    );
}
