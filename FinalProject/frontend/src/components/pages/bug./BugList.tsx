import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Bug = {
  _id: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  createdOn: string;
  createdBy: string;
  classification: string;
  closed: boolean;
};

function BugList() {
  const { id } = useParams<{ id?: string }>();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBugs() {
      try {
        const url = id
          ? `http://localhost:5000/api/bugs/${id}`
          : `http://localhost:5000/api/bugs`;

        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of bugs.");
        }

        setBugs(data);
      } catch (err) {
        console.error("Error fetching bug(s):", err);
        setError((err as Error).message || "Failed to fetch bug(s)");
      } finally {
        setLoading(false);
      }
    }

    fetchBugs();
  }, [id]);

  if (loading) return <div className="flex justify-center py-10">Loading bugs...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-600">{error}</div>;
  if (bugs.length === 0) return <div className="flex justify-center py-10">No bugs found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-6xl shadow-lg border border-gray-200 dark:border-gray-600 bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {id ? "Bug Details" : "Bug List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="table-auto w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.map((bug) => (
                  <TableRow key={bug._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <TableCell className="text-blue-600">
                      <Link to={`/bugs/${bug._id}`} className="hover:underline">
                        {bug._id}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{bug.title}</TableCell>
                    <TableCell>{bug.createdBy}</TableCell>
                    <TableCell>{bug.classification}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          bug.closed
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {bug.closed ? "Closed" : "Open"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(bug.createdOn).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BugList;
