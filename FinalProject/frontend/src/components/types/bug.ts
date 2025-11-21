export type BugPriority = "low" | "medium" | "high" | "critical";
export type BugStatus = "open" | "resolved";

export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: BugPriority;
  status: BugStatus;
  createdAt: Date;
}
