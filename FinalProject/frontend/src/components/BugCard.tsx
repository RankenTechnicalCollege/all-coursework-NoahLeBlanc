import { Bug } from "@/types/bug";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BugCardProps {
  bug: Bug;
}

const priorityConfig = {
  low: { color: "bg-low text-low-foreground", label: "Low" },
  medium: { color: "bg-medium text-medium-foreground", label: "Medium" },
  high: { color: "bg-high text-high-foreground", label: "High" },
  critical: { color: "bg-critical text-critical-foreground", label: "Critical" },
};

export const BugCard = ({ bug }: BugCardProps) => {
  const priorityStyle = priorityConfig[bug.priority];

  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md border-border/50",
      bug.status === "resolved" && "opacity-60"
    )}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={priorityStyle.color}>
            {priorityStyle.label}
          </Badge>
          {bug.status === "resolved" && (
            <Badge className="bg-resolved text-resolved-foreground">
              Resolved
            </Badge>
          )}
        </div>
        <h3 className={cn(
          "font-semibold text-lg",
          bug.status === "resolved" && "line-through text-muted-foreground"
        )}>
          {bug.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {bug.description}
        </p>
        <p className="text-xs text-muted-foreground">
          Created: {bug.createdAt.toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};
