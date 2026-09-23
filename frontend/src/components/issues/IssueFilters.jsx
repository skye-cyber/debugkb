import { X, SlidersHorizontal } from "lucide-react";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { SEVERITIES, STATUSES } from "../../utils/constants";
import { cn } from "../../utils/cn";

export default function IssueFilters({
  filters,
  onChange,
  availableTags = [],
  className,
}) {
  const toggleArrayValue = (key, value) => {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    (filters.severity?.length ?? 0) +
    (filters.status?.length ?? 0) +
    (filters.tags?.length ?? 0);

  const clearAll = () =>
    onChange({ q: filters.q ?? "", severity: [], status: [], tags: [] });

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="h-3 w-3" />
            Clear ({activeCount})
          </Button>
        )}
      </div>

      {/* Severity */}
      <section>
        <h4 className="mb-2 text-xs font-semibold text-fg">Severity</h4>
        <div className="space-y-1.5">
          {SEVERITIES.map(({ value, label }) => (
            <Checkbox
              key={value}
              label={label}
              checked={filters.severity?.includes(value) ?? false}
              onChange={() => toggleArrayValue("severity", value)}
            />
          ))}
        </div>
      </section>

      {/* Status */}
      <section>
        <h4 className="mb-2 text-xs font-semibold text-fg">Status</h4>
        <div className="space-y-1.5">
          {STATUSES.map(({ value, label }) => (
            <Checkbox
              key={value}
              label={label}
              checked={filters.status?.includes(value) ?? false}
              onChange={() => toggleArrayValue("status", value)}
            />
          ))}
        </div>
      </section>

      {/* Tags */}
      {availableTags.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-semibold text-fg">Tags</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.slice(0, 24).map((tag) => {
              const active = filters.tags?.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleArrayValue("tags", tag)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors",
                    active
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-surface border-border text-fg-muted hover:text-fg hover:border-fg-muted",
                  )}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </aside>
  );
}
