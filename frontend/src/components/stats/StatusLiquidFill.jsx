import { useEffect, useMemo, useState } from "react";

const STATUS_VAR = {
  Resolved:   "--st-resolved",
  Partial:    "--st-partial",
  Workaround: "--st-workaround",
  Unresolved: "--st-unresolved",
};

function readColor(varName) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  const parts = raw.split(/\s+/).map(Number);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
    ? `rgb(${parts.join(", ")})`
    : "rgb(128, 128, 128)";
}

export default function StatusLiquidFill({ data = [] }) {
  const [colors, setColors] = useState({});
  const [mounted, setMounted] = useState(false);

  const total = useMemo(
    () => data.reduce((s, d) => s + (d.value ?? 0), 0),
    [data]
  );

  useEffect(() => {
    const read = () => {
      const next = {};
      for (const d of data) {
        const v = STATUS_VAR[d.label];
        if (v) next[d.label] = readColor(v);
      }
      setColors(next);
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [data]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!data.length || total === 0) {
    return <div className="text-sm text-fg-muted">No status data yet.</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((d) => {
        const pct = (d.value / total) * 100;
        const color = colors[d.label] ?? "rgb(128, 128, 128)";
        return (
          <div key={d.label}>
            <div className="flex items-baseline justify-between text-xs mb-1.5">
              <span>{d.label}</span>
              <span className="text-fg-muted tabular-nums">
                {d.value} ({Math.round(pct)}%)
              </span>
            </div>
            <div className="relative h-3.5 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  background: color,
                  transition: mounted
                    ? "width 700ms cubic-bezier(0.2, 0.9, 0.25, 1)"
                    : "none",
                }}
              >
                {/* Shimmer overlay */}
                <span className="liquid-shimmer" aria-hidden="true" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
