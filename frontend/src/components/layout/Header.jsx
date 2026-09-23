import { Search, Plus, Sun, Moon, Command } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

export default function Header() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "border-b border-border bg-surface/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-fg font-bold text-sm shadow-soft">
              D
            </div>
            <span className="hidden sm:block font-semibold tracking-tight">
              DebugKB
            </span>
          </Link>

          {/* Search */}
          <button
            onClick={() => navigate("/search")}
            className={cn(
              "group flex flex-1 max-w-xl items-center gap-2 rounded-lg",
              "border border-border bg-muted/60 hover:bg-muted",
              "px-3 py-1.5 text-sm text-fg-muted",
              "transition-colors",
            )}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search issues…</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-fg-muted">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          {/* Actions */}
          <Link
            to="/issues/new"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg",
              "bg-primary text-primary-fg hover:brightness-110",
              "px-3 py-1.5 text-sm font-medium shadow-soft",
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </Link>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg",
              "border border-border bg-surface hover:bg-muted",
              "text-fg-muted",
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
