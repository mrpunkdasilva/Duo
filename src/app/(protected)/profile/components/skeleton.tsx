import { Skeleton, SkeletonCircle, SkeletonLine, SkeletonCard, SkeletonSquare } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard>
        <Skeleton className="h-24 rounded-none" />
        <div className="relative px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <SkeletonCircle className="h-24 w-24 ring-4 ring-background" />
          </div>
          <SkeletonLine className="h-5 w-32 mb-2" />
          <SkeletonLine className="h-4 w-48" />
        </div>
      </SkeletonCard>

      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
            <SkeletonSquare className="h-10 w-10 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLine className="h-4 w-28" />
              <SkeletonLine className="h-3 w-44" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
