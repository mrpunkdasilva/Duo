export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border-0 shadow-sm overflow-hidden rounded-lg">
        <div className="h-24 bg-muted animate-pulse" />
        <div className="relative px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse ring-4 ring-background" />
          </div>
          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-28 bg-muted animate-pulse rounded" />
              <div className="h-3 w-44 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
    </div>
  );
}
