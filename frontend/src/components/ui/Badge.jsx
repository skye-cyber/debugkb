import { cn } from "../../utils/cn";

const tones = {
  neutral: "bg-muted text-fg-muted border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  critical: "bg-sev-critical/10 text-sev-critical border-sev-critical/20",
  high: "bg-sev-high/10 text-sev-high border-sev-high/20",
  medium: "bg-sev-medium/10 text-sev-medium border-sev-medium/20",
  low: "bg-sev-low/10 text-sev-low border-sev-low/20",
  resolved:
    "bg-status-resolved/10 text-status-resolved border-status-resolved/20",
  unresolved:
    "bg-status-unresolved/10 text-status-unresolved border-status-unresolved/20",
  partial: "bg-status-partial/10 text-status-partial border-status-partial/20",
  workaround:
    "bg-status-workaround/10 text-status-workaround border-status-workaround/20",
};

export default function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5",
        "text-[11px] font-medium leading-none",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
