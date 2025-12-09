import { User } from "../types/user";
import { UserCard } from "../UserCards";
import { Button } from "@/components/ui/button";
import { Users as UsersIcon, Plus } from "lucide-react";

const sampleUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "admin",
    status: "active",
    joinedAt: new Date(2024, 0, 15),
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    role: "moderator",
    status: "active",
    joinedAt: new Date(2024, 2, 20),
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "user",
    status: "inactive",
    joinedAt: new Date(2023, 11, 5),
  },
];

export const UserList = () => {
  const activeUsers = sampleUsers.filter(user => user.status === "active");
  const inactiveUsers = sampleUsers.filter(user => user.status === "inactive");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage all your users</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{activeUsers.length}</span> active
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{inactiveUsers.length}</span> inactive
              </span>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {sampleUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

