import { useEffect, useRef, useState } from "react";

export default function TickingNumber({ value, duration = 900 }) {
  const [shown, setShown] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setShown(value);
      return;
    }
    startRef.current = null;
    const target = Number(value) || 0;

    function frame(now) {
      if (startRef.current == null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(target * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span>{shown}</span>;
}
