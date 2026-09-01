import { cn } from "@/lib/utils";

function PageContainer({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-4 pt-4 space-y-6 max-w-lg mx-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { PageContainer };
