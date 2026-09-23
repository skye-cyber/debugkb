export default function IssueListSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="px-4 sm:px-5 py-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
          <div className="h-4 w-3/4 rounded bg-muted mb-2" />
          <div className="h-3 w-1/2 rounded bg-muted mb-3" />
          <div className="flex gap-1.5">
            <div className="h-4 w-14 rounded bg-muted" />
            <div className="h-4 w-12 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}
