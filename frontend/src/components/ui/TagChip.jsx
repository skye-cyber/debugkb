import { Hash } from "lucide-react";
import { cn } from "../../utils/cn";

export default function TagChip({ tag, className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5",
        "text-[11px] font-mono text-fg-muted hover:text-fg transition-colors",
        className,
      )}
      {...props}
    >
      <Hash className="h-3 w-3 opacity-60" />
      {tag}
    </span>
  );
}
