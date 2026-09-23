import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bug,
  Search,
  Upload,
  GraduationCap,
  Tags,
  BarChart3,
} from "lucide-react";
import { cn } from "../../utils/cn";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/issues", label: "Issues", icon: Bug },
  { to: "/search", label: "Search", icon: Search },
  { to: "/import", label: "Import", icon: Upload },
  { to: "/skills", label: "Skills", icon: GraduationCap },
  { to: "/tags", label: "Tags", icon: Tags },
  { to: "/stats", label: "Stats", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside
      className={cn(
        "hidden lg:flex w-60 shrink-0 flex-col",
        "border-r border-border bg-surface",
      )}
    >
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                "transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-fg-muted hover:bg-muted hover:text-fg",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs font-medium text-fg">DebugKB</p>
          <p className="mt-0.5 text-[11px] text-fg-muted">
            Personal debugging knowledge base
          </p>
        </div>
      </div>
    </aside>
  );
}
