import { Bug } from "../types/bug";
import { BugCard } from "@/components/BugCard";
import { Button } from "@/components/ui/button";
import { Bug as BugIcon, Plus } from "lucide-react";

const sampleBugs: Bug[] = [
  {
    id: "1",
    title: "Login button not responding on mobile",
    description: "The login button doesn't trigger any action when tapped on iOS devices.",
    priority: "high",
    status: "open",
    createdAt: new Date(2025, 0, 15),
  },
  {
    id: "2",
    title: "Memory leak in dashboard",
    description: "Dashboard page shows increasing memory usage over time.",
    priority: "critical",
    status: "open",
    createdAt: new Date(2025, 0, 16),
  },
  {
    id: "3",
    title: "Typo in footer text",
    description: "Footer has 'Copyrigth' instead of 'Copyright'.",
    priority: "low",
    status: "resolved",
    createdAt: new Date(2025, 0, 14),
  },
];

const BugList = () => {
  const openBugs = sampleBugs.filter(bug => bug.status === "open");
  const resolvedBugs = sampleBugs.filter(bug => bug.status === "resolved");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BugIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Bug Tracker</h1>
              <p className="text-muted-foreground">Track and manage all your bugs</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{openBugs.length}</span> open
              </span>
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{resolvedBugs.length}</span> resolved
              </span>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bug
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {sampleBugs.map(bug => (
            <BugCard key={bug.id} bug={bug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BugList;