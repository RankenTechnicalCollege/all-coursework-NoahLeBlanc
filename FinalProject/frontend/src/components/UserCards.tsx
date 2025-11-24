import { User } from "./types/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, CheckCircle, XCircle } from "lucide-react";

interface UserCardProps {
  user: User;
}

const roleBadgeVariants = {
  admin: "bg-critical/20 text-critical border-critical/30",
  moderator: "bg-high/20 text-high border-high/30",
  user: "bg-low/20 text-low border-low/30",
};

export const UserCard = ({ user }: UserCardProps) => {
  const formattedDate = user.joinedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={roleBadgeVariants[user.role]}>
              {user.role}
            </Badge>
            {user.status === "active" ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Joined {formattedDate}
        </div>
      </CardContent>
    </Card>
  );
};
