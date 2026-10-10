import { useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";

const SEVERITY_VAR = {
    Critical: "--sev-critical",
    High: "--sev-high",
    Medium: "--sev-medium",
    Low: "--sev-low",
};

const R = 80;
const CIRC = 2 * Math.PI * R;
const GAP = 0;

function readColor(varName) {
    const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    const parts = raw.split(/\s+/).map(Number);
    return parts.length === 3 && parts.every((n) => !Number.isNaN(n))
        ? `rgb(${parts.join(", ")})`
        : "rgb(128, 128, 128)";
}

export default function SeverityArcMeter({ data = [] }) {
    const total = useMemo(
        () => data.reduce((s, d) => s + (d.value ?? 0), 0),
        [data]
    );

    const [hovered, setHovered] = useState(null);
    const [colors, setColors] = useState({});
    const [animate, setAnimate] = useState(false);
    const [drawn, setDrawn] = useState(false);

    // Read theme colors; re-read on dark class change
    useEffect(() => {
        const read = () => {
            const next = {};
            for (const d of data) {
                const v = SEVERITY_VAR[d.label];
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

    // Trigger draw animation once mounted
    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            setDrawn(true);
            return;
        }
        setAnimate(true);
        const id = requestAnimationFrame(() => setDrawn(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Compute arc offsets
    const slices = useMemo(() => {
        let offset = 0;
        return data.map((d) => {
            const len = total > 0 ? (d.value / total) * CIRC : 0;
            const slice = { def: d, len, offset };
            offset += len + GAP;
            return slice;
        });
    }, [data, total]);

    if (!data.length || total === 0) {
        return (
            <div className="text-sm text-fg-muted">No severity data yet.</div>
        );
    }

    const centerValue = hovered ? hovered.value : total;
    const centerLabel = hovered ? hovered.label : "Total";

    return (
        <div className="flex items-center w-full gap-0.5 ">
            {/* Ring */}
            <div className="relative w-[200px] h-[200px] mx-auto">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle
                        cx="100"
                        cy="100"
                        r={R}
                        fill="none"
                        strokeWidth="18"
                        className="stroke-muted"
                    />
                    {slices.map((s, i) => {
                        const color = colors[s.def.label] ?? "rgb(128,128,128)";
                        const isHovered = hovered?.label === s.def.label;
                        const isDimmed = hovered && !isHovered;
                        const drawn = animate ? s.len - GAP : s.len - GAP;

                        return (
                            <circle
                                key={s.def.label}
                                cx="100"
                                cy="100"
                                r={R}
                                fill="none"
                                stroke={color}
                                strokeWidth={isHovered ? 12 : 14}
                                strokeDasharray={
                                    drawn
                                        ? `${Math.max(0, s.len - GAP)} ${CIRC}`
                                        : `0 ${CIRC}`
                                }
                                strokeDashoffset={-s.offset}
                                strokeLinecap="butt"
                                onMouseEnter={() => setHovered(s.def)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    transition: animate
                                        ? "stroke-dasharray 900ms cubic-bezier(0.2,0.9,0.25,1), stroke-width 200ms ease, opacity 200ms ease"
                                        : "stroke-width 200ms ease, opacity 200ms ease",
                                    opacity: isDimmed ? 0.25 : 1,
                                    cursor: "pointer",
                                }}
                            />
                        );
                    })}
                </svg>

                <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
                    <div>
                        <div className="text-2xl font-semibold tracking-tight tabular-nums">
                            {centerValue}
                        </div>
                        <div className="text-[11px] text-fg-muted mt-1">
                            {centerLabel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <ul className="hidden flex flex-col items-start space-y-0.5">
                {data.map((d) => {
                    const color = colors[d.label] ?? "rgb(128,128,128)";
                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                    const isHovered = hovered?.label === d.label;
                    return (
                        <li
                            key={d.label}
                            onMouseEnter={() => setHovered(d)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-2 py-1.5 cursor-pointer transition-colors",
                                isHovered ? "bg-muted/60" : "hover:bg-muted/40"
                            )}
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-sm shrink-0"
                                style={{ background: color }}
                            />
                            <span className="flex-1 text-xs">{d.label}</span>
                            <span className="text-xs text-fg-muted tabular-nums">
                                {d.value} ({pct}%)
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
