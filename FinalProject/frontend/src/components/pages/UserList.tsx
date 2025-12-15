//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

//|====================================================================================================|
//|----------------------------------------------[-Types-]---------------------------------------------|
//|====================================================================================================|
type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function UserPage() {
    const [users, setUsers] = useState<User[]>([]);               // array of User
    const [loading, setLoading] = useState<boolean>(true);        // loading state
    const [error, setError] = useState<string | null>(null);      // error message or null

    useEffect(() => {
        async function fetchUsers() {
            try {
                // Fetch users from backend
                const response = await fetch(`${API_URL}/users`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: User[][] = await response.json();        // backend returns [foundData]
                setUsers(data[0] || []);                             // unwrap inner array
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users");                  // show error
            } finally {
                setLoading(false);                                   // hide loading
            }
        }
        fetchUsers();
    }, []);

    // Loading state
    if (loading) return <div>Loading users...</div>;
    // Error state
    if (error) return <div>{error}</div>;
    // Empty state
    if (users.length === 0) return <div>No users found.</div>;

    return (
        <div className="flex justify-center">
            <Card className="w-1/2 p-4">
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {/* Action icon can link to user editor page */}
                                        <img
                                            className="w-5 h-5"
                                            src="/gear-svgrepo-com.svg"
                                            alt="Edit User"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default UserPage;
