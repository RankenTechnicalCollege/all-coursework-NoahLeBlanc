import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function UsersMePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:2023/api/user/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // ✅ Fixed syntax
        }

        const responseText = await response.text();
        console.log("Raw response:", responseText); // 🔍 Debug log

        const data = JSON.parse(responseText);
        console.log("Parsed data:", data); // 🔍 Debug log

        const userData = data[0]; // Assuming backend returns an array with one user
        console.log("User data:", userData); // 🔍 Debug log

        if (!userData) {
          throw new Error("User data not found");
        }

        const transformedUser: User = {
          id: userData._id,
          name: userData.fullName || userData.name || "Unknown", // ✅ Added fallbacks
          email: userData.email,
          role: Array.isArray(userData.role) && userData.role.length > 0 ? userData.role[0] : "user",
        };

        console.log("Transformed user:", transformedUser); // 🔍 Debug log
        setUser(transformedUser);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch your info");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center py-10 text-lg">Loading your info...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center py-10 text-red-600 text-lg">{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center py-10 text-lg">No user info available</div>;
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">Your Profile</CardTitle>
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
                <TableRow className="hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                  <TableCell className="py-2 px-4 text-sm text-gray-700">{user.id}</TableCell>
                  <TableCell className="py-2 px-4 text-sm font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="py-2 px-4 text-sm text-gray-700">{user.email}</TableCell>
                  <TableCell className="py-2 px-4 text-sm text-gray-700">{user.role}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UsersMePage;