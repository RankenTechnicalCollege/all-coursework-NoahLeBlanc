import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function UserList() {
  const { id } = useParams<{ id?: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let response;

        if (id) {
          // Fetch single user by ID
          response = await fetch(`http://localhost:2023/api/users/${id}`, {
            credentials: "include",
          });
        } else {
          // Fetch all users
          response = await fetch("http://localhost:2023/api/users", {
            credentials: "include",
          });
        }

        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        const usersData = id ? [data[0] || data] : data[0] || [];

        const transformedUsers: User[] = usersData.map((user: any) => ({
          id: user._id,
          name: user.fullName,
          email: user.email,
          role: Array.isArray(user.role) && user.role.length > 0 ? user.role[0] : "",
        }));

        setUsers(transformedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch user(s)");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center py-10 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center py-10 text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            {id ? "User Details" : "User List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <TableCell className="py-2 px-4 text-sm text-blue-600">
                      {/* Clickable ID */}
                      <Link to={`/users/${user.id}`} className="hover:underline">
                        {user.id}
                      </Link>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-sm font-medium text-gray-900">{user.name}</TableCell>
                    <TableCell className="py-2 px-4 text-sm text-gray-700">{user.email}</TableCell>
                    <TableCell className="py-2 px-4 text-sm text-gray-700">{user.role}</TableCell>
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

export default UserList;
