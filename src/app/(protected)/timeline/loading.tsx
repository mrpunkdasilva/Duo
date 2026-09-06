import { Stack } from "@/components/ui/stack";
import { SkeletonCard, SkeletonLine, Skeleton } from "@/components/ui/skeleton";

export default function TimelineLoading() {
  return (
    <div className="px-4 pt-4 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-8 w-32" />
      </div>
      <Stack gap={4}>
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i}>
            <div className="p-4 flex gap-3">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="h-4 w-20" />
                <SkeletonLine className="h-5 w-40" />
                <SkeletonLine className="h-3 w-24" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </Stack>
    </div>
  );
}
