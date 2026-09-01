import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

function SkeletonCircle({ className, ...props }: React.ComponentProps<"div">) {
  return <Skeleton className={cn("rounded-full", className)} {...props} />;
}

function SkeletonSquare({ className, ...props }: React.ComponentProps<"div">) {
  return <Skeleton className={cn("rounded-lg", className)} {...props} />;
}

function SkeletonLine({ className, ...props }: React.ComponentProps<"div">) {
  return <Skeleton className={cn("h-4 w-full rounded", className)} {...props} />;
}

function SkeletonCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-0 shadow-sm overflow-hidden rounded-lg", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Skeleton, SkeletonCircle, SkeletonSquare, SkeletonLine, SkeletonCard };
