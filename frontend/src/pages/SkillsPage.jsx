import { Link } from "react-router-dom";
import { GraduationCap, TrendingUp, Layers } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

const SKILLS = [
  {
    id: 1,
    name: "Django Architecture",
    category: "Django",
    proficiency: 8,
    issues: 12,
  },
  {
    id: 2,
    name: "Python Debugging",
    category: "Python",
    proficiency: 7,
    issues: 9,
  },
  { id: 3, name: "Linux / Kali", category: "Linux", proficiency: 6, issues: 7 },
  {
    id: 4,
    name: "PostgreSQL",
    category: "Database",
    proficiency: 6,
    issues: 5,
  },
  {
    id: 5,
    name: "Docker Networking",
    category: "DevOps",
    proficiency: 5,
    issues: 4,
  },
  {
    id: 6,
    name: "React Patterns",
    category: "Frontend",
    proficiency: 7,
    issues: 6,
  },
  {
    id: 7,
    name: "Nginx Configuration",
    category: "DevOps",
    proficiency: 5,
    issues: 3,
  },
  {
    id: 8,
    name: "Systemd Services",
    category: "Linux",
    proficiency: 6,
    issues: 4,
  },
];

const GROUPS = SKILLS.reduce((acc, s) => {
  (acc[s.category] ??= []).push(s);
  return acc;
}, {});

export default function SkillsPage() {
  const total = SKILLS.length;
  const avg = SKILLS.reduce((sum, s) => sum + s.proficiency, 0) / total;

  return (
    <>
      <PageHeader
        title="Skills"
        description="Capabilities gained through solving real problems."
        actions={
          <div className="hidden sm:flex items-center gap-3">
            <StatPill icon={GraduationCap} label={`${total} skills`} />
            <StatPill icon={TrendingUp} label={`avg ${avg.toFixed(1)}/10`} />
            <StatPill
              icon={Layers}
              label={`${Object.keys(GROUPS).length} areas`}
            />
          </div>
        }
      />

      {total === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No skills tracked yet"
          description="Skills emerge as you resolve issues and record lessons learned."
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(GROUPS).map(([category, skills]) => (
            <section key={category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                {category}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function StatPill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-fg-muted">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function SkillCard({ skill }) {
  return (
    <Link to={`/skills/${skill.id}`} className="group block">
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardBody>
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold leading-snug">{skill.name}</h3>
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
              {skill.proficiency}/10
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${skill.proficiency * 10}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-fg-muted">
            <span>{skill.category}</span>
            <span>{skill.issues} issues</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
