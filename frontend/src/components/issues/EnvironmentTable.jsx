import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";
import { Server } from "lucide-react";

export default function EnvironmentTable({ environment }) {
  if (!environment || Object.keys(environment).length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Server className="h-4 w-4 text-fg-muted" />
        <CardTitle>Environment</CardTitle>
      </CardHeader>
      <CardBody>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-xs">
          {Object.entries(environment).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-mono text-fg-muted">{k}</dt>
              <dd className="font-mono text-fg break-all">{v}</dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}
