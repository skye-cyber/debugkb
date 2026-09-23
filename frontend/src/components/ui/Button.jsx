import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-primary text-primary-fg hover:brightness-110 shadow-soft",
  secondary: "bg-muted text-fg hover:bg-muted/70 border border-border",
  ghost: "text-fg-muted hover:bg-muted hover:text-fg",
  danger: "bg-sev-critical text-white hover:brightness-110 shadow-soft",
  outline: "border border-border bg-surface hover:bg-muted text-fg",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-9 w-9",
};

export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <As
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-all duration-150 ease-snap",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
