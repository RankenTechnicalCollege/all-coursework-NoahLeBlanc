import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Bug, AlertCircle, Clock, CheckCircle2, XCircle, Save, Tag } from "lucide-react";

const bugSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  assignee: z.string().min(2, "Assignee name required").max(100),
  tags: z.string(),
});

type BugFormValues = z.infer<typeof bugSchema>;

const priorityConfig = {
  low: { color: "bg-priority-low", icon: Bug, label: "Low" },
  medium: { color: "bg-priority-medium", icon: AlertCircle, label: "Medium" },
  high: { color: "bg-priority-high", icon: AlertCircle, label: "High" },
  critical: { color: "bg-priority-critical", icon: AlertCircle, label: "Critical" },
};

const statusConfig = {
  open: { color: "bg-status-open", icon: Clock, label: "Open" },
  "in-progress": { color: "bg-status-progress", icon: Clock, label: "In Progress" },
  resolved: { color: "bg-status-resolved", icon: CheckCircle2, label: "Resolved" },
  closed: { color: "bg-status-closed", icon: XCircle, label: "Closed" },
};

const BugEdit = () => {
  const form = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      assignee: "",
      tags: "",
    },
  });

  const onSubmit = (data: BugFormValues) => {
    console.log("Bug data:", data);
    toast.success("Bug updated successfully!", {
      description: `${data.title} has been saved.`,
    });
  };

  const selectedPriority = form.watch("priority");
  const selectedStatus = form.watch("status");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bug className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Edit Bug Report</h1>
              <p className="text-muted-foreground mt-1">Update bug details and track resolution</p>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${priorityConfig[selectedPriority].color}`} />
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Badge variant="outline" className="font-medium">
                {priorityConfig[selectedPriority].label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusConfig[selectedStatus].color}`} />
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant="outline" className="font-medium">
                {statusConfig[selectedStatus].label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-8 bg-card border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Bug Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of the bug..."
                        className="text-lg h-12 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title that describes the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
                        className="min-h-[200px] bg-background resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include steps to reproduce, expected behavior, and actual behavior
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(priorityConfig).map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                  <Icon className="h-4 w-4" />
                                  <span>{config.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How urgent is this bug?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                  <Icon className="h-4 w-4" />
                                  <span>{config.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Current state of the bug
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assignee */}
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Assignee</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Who's working on this?"
                        className="h-12 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The team member responsible for fixing this bug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="frontend, api, authentication (comma-separated)"
                        className="h-12 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add tags to categorize this bug (comma-separated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  size="lg"
                  className="min-w-[200px] h-12 text-base font-semibold"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default BugEdit;

