import { cn } from "../../utils/cn";

export default function PageHeader({ title, description, actions, className }) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 mb-6", className)}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight truncate text-gray-600 dark:text-gray-100">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
