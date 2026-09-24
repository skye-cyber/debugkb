import { useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

/**
 * A container that displaces slightly toward the cursor when the
 * pointer is within `radius` px. Uses a simple critically-damped
 * spring integrated per frame.
 */
export default function SpringCard({
  as: As = "div",
  radius = 180,
  maxOffset = 6,
  stiffness = 0.12,
  damping = 0.75,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const stateRef = useRef({
    x: 0, y: 0,       // current offset
    vx: 0, vy: 0,     // velocity
    tx: 0, ty: 0,     // target offset
    raf: 0,
  });

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

      if (dist > radius) {
        state.tx = 0;
        state.ty = 0;
      } else {
        const force = 1 - dist / radius;
        state.tx = (dx / dist || 0) * maxOffset * force;
        state.ty = (dy / dist || 0) * maxOffset * force;
      }
    }

    function onLeave() {
      state.tx = 0;
      state.ty = 0;
    }

    function tick() {
      state.raf = requestAnimationFrame(tick);
      state.vx += (state.tx - state.x) * stiffness;
      state.vy += (state.ty - state.y) * stiffness;
      state.vx *= damping;
      state.vy *= damping;
      state.x += state.vx;
      state.y += state.vy;

      if (
        Math.abs(state.x) < 0.01 &&
        Math.abs(state.y) < 0.01 &&
        state.tx === 0 &&
        state.ty === 0
      ) {
        el.style.transform = "";
      } else {
        el.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
      }
    }

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [radius, maxOffset, stiffness, damping]);

  return (
    <As
      ref={ref}
      className={cn(
        "rounded-xl border border-border bg-surface shadow-soft will-change-transform",
        className
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
