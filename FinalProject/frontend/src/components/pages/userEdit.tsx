import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, Edit2, Trash2, Mail, Shield, CheckCircle2, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  role: z.enum(["admin", "moderator", "user"]),
  status: z.enum(["active", "inactive", "pending"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface User extends UserFormValues {
  id: string;
}

const roleConfig = {
  admin: { color: "bg-priority-critical", icon: Shield, label: "Admin" },
  moderator: { color: "bg-priority-medium", icon: Shield, label: "Moderator" },
  user: { color: "bg-primary", icon: Users, label: "User" },
};

const statusConfig = {
  active: { color: "bg-status-resolved", icon: CheckCircle2, label: "Active" },
  inactive: { color: "bg-status-closed", icon: XCircle, label: "Inactive" },
  pending: { color: "bg-status-progress", icon: CheckCircle2, label: "Pending" },
};

const UserEdit = () => {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "moderator", status: "active" },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "user", status: "pending" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", role: "user", status: "active" },
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "pending",
    },
  });

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsAddMode(false);
    form.reset(user);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingUser(null);
    setIsAddMode(true);
    form.reset({
      name: "",
      email: "",
      role: "user",
      status: "pending",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: UserFormValues) => {
    if (isAddMode) {
      const newUser: User = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      setUsers([...users, newUser]);
      toast.success("User added successfully!", {
        description: `${data.name} has been added to the system.`,
      });
    } else if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
      toast.success("User updated successfully!", {
        description: `${data.name}'s information has been updated.`,
      });
    }
    setIsDialogOpen(false);
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast.success("User deleted", {
      description: `${user?.name} has been removed from the system.`,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background p-4 md:p-8 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage system users and permissions</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} size="lg" className="font-semibold">
                <UserPlus className="mr-2 h-5 w-5" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {isAddMode ? "Add New User" : "Edit User"}
                </DialogTitle>
                <DialogDescription>
                  {isAddMode
                    ? "Create a new user account with the information below."
                    : "Update user information and permissions."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="user@example.com"
                            className="h-11 bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(roleConfig).map(([key, config]) => {
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-background">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="font-semibold">
                      {isAddMode ? "Add User" : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold mt-1">{users.filter(u => u.status === "active").length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-status-resolved" />
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-1">{users.filter(u => u.status === "pending").length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-status-progress" />
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-3xl font-bold mt-1">{users.filter(u => u.role === "admin").length}</p>
              </div>
              <Shield className="h-8 w-8 text-priority-critical" />
            </div>
          </Card>
        </div>

        {/* User Table */}
        <Card className="bg-card border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const RoleIcon = roleConfig[user.role].icon;
                const StatusIcon = statusConfig[user.status].icon;
                
                return (
                  <TableRow key={user.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        <div className={`w-2 h-2 rounded-full mr-2 ${roleConfig[user.role].color}`} />
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleConfig[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig[user.status].color}`} />
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[user.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="h-8"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="h-8 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
        </div>
      </div>
    </>
  );
};

export default UserEdit;

