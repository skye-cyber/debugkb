export function formatDate(iso, opts = {}) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  });
}

export function formatRelative(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((then - now) / 1000);
  const units = [
    ["year",   60 * 60 * 24 * 365],
    ["month",  60 * 60 * 24 * 30],
    ["week",   60 * 60 * 24 * 7],
    ["day",    60 * 60 * 24],
    ["hour",   60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs || unit === "second") {
      return rtf.format(Math.round(diff / secs), unit);
    }
  }
}

export function daysBetween(a, b) {
  if (!a || !b) return null;
  const ms = new Date(b) - new Date(a);
  const d = ms / (1000 * 60 * 60 * 24);
  if (d < 1) return "less than a day";
  if (d < 2) return "1 day";
  return `${Math.round(d)} days`;
}
