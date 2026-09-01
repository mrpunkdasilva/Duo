import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  action?: React.ReactNode;
}

function PageHeader({ title, action, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <Heading as="h1" variant="page">{title}</Heading>
      {action}
    </div>
  );
}

export { PageHeader };
