import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "rounded-xl border border-dashed border-border bg-surface/50",
        "px-6 py-16",
        className,
      )}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-fg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
