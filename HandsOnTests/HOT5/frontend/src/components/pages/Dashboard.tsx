import { Card } from "@/components/ui/card"; // Example shadcn Card component
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-medium">Users</h2>
          <p className="text-2xl font-bold">1,234</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-medium">Revenue</h2>
          <p className="text-2xl font-bold">$12,345</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-medium">Orders</h2>
          <p className="text-2xl font-bold">567</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-medium">Feedback</h2>
          <p className="text-2xl font-bold">89</p>
        </Card>
      </div>

      {/* Action Section */}
      <div className="flex justify-end">
        <Button>New Report</Button>
      </div>

      {/* Example Cards/Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <ul className="space-y-1">
            <li>User John signed up</li>
            <li>Order #1234 completed</li>
            <li>Feedback received</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p>Charts or stats could go here!</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
