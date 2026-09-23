import { Card, CardBody } from "../ui/Card";

export default function IssueDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded bg-muted" />
          <div className="h-5 w-20 rounded bg-muted" />
        </div>
        <div className="h-7 w-3/4 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardBody className="space-y-3">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-4/6 rounded bg-muted" />
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardBody className="space-y-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
