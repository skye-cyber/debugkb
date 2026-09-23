import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Checkbox({ checked, onChange, label, className }) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none group",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors",
          checked
            ? "bg-primary border-primary text-primary-fg"
            : "border-border bg-surface group-hover:border-fg-muted",
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-fg">{label}</span>
    </label>
  );
}
