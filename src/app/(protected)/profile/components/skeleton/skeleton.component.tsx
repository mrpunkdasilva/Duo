import { Skeleton, SkeletonCircle, SkeletonLine, SkeletonCard, SkeletonMenuItem } from "@/components/ui/skeleton";
import { Stack } from "@/components/ui/stack";
import { Box } from "@/components/ui/box";

export function ProfileSkeleton() {
  return (
    <Stack gap={4}>
      <SkeletonCard>
        <Skeleton className="h-24 rounded-none" />
        
        <Box className="px-6 pb-6 -mt-12 mb-4 relative">
          <SkeletonCircle className="h-24 w-24 ring-4 ring-background" />
          <SkeletonLine className="h-5 w-32 mt-4 mb-2" />
          <SkeletonLine className="h-4 w-48" />
        </Box>
      </SkeletonCard>

      <Stack gap={2}>
        {[...Array(4)].map((_, i) => (
          <SkeletonMenuItem key={i} />
        ))}
      </Stack>

      <Skeleton className="h-12 w-full rounded-xl" />
    </Stack>
  );
}
