import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function UserMePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await fetch("http://localhost:2023/api/user/me", {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Your API returns an array with a single user
        const userData = Array.isArray(data) ? data[0] : data;

        const transformedUser: User = {
          id: userData._id,
          name: userData.fullName || "",
          email: userData.email || "",
          role: Array.isArray(userData.role) && userData.role.length > 0 ? userData.role[0] : "",
        };

        setUser(transformedUser);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:2023/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: user.name,
          email: user.email,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setSuccess("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-600 text-lg">{error}</div>;
  if (!user) return <div className="flex justify-center py-10 text-lg">No user data found.</div>;

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-2xl font-semibold text-gray-800">Edit Your Info</CardTitle>
        </CardHeader>
        <CardContent>
          {success && <div className="text-green-600 mb-4">{success}</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={user.role}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserMePage;
