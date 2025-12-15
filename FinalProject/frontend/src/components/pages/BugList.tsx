//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//|====================================================================================================|
//|----------------------------------------------[-Types-]---------------------------------------------|
//|====================================================================================================|
type Bug = {
    id: number;
    title: string;
    status: string;
    priority: string;
    assignedTo: string;
}

//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function BugList() {
    const [bugs, setBugs] = useState<Bug[]>([]);           // array of Bug
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBugs() {
            try {
                const response = await fetch('/api/bugs');  // endpoint for bugs
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Bug[][] = await response.json(); // backend returns [foundData]
                setBugs(data[0] || []);                      // unwrap inner array
            } catch (err) {
                console.error(err);
                setError("Failed to fetch bugs");           // display error
            } finally {
                setLoading(false);
            }
        }
        fetchBugs();
    }, []);

    if (loading) return <div>Loading bugs...</div>;
    if (error) return <div>{error}</div>;
    if (bugs.length === 0) return <div>No bugs found.</div>;

    return (
        <div className="flex justify-center">
            <Card className="w-1/2 p-4">
                <CardHeader>
                    <CardTitle>Bug List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bugs.map((bug) => (
                                <TableRow key={bug.id}>
                                    <TableCell>{bug.id}</TableCell>
                                    <TableCell>{bug.title}</TableCell>
                                    <TableCell>{bug.status}</TableCell>
                                    <TableCell>{bug.priority}</TableCell>
                                    <TableCell>{bug.assignedTo}</TableCell>
                                    <TableCell>
                                        <Link to={`/bug/${bug.id}`}>
                                            <img
                                                className="w-5 h-5"
                                                src="/gear-svgrepo-com.svg"
                                                alt="Edit Bug"
                                            />
                                        </Link>
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

export default BugList;
