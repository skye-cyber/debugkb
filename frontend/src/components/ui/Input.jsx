import { cn } from "../../utils/cn";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-surface",
        "px-3 py-2 text-sm text-fg placeholder:text-fg-muted",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}
