import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded-lg border border-border bg-surface",
          "pl-3 pr-8 py-2 text-sm text-fg",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          "transition-colors cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
    </div>
  );
}
