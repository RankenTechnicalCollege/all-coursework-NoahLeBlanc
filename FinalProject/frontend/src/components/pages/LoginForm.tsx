import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Sign in
      const res = await apiClient.post("/auth/sign-in/email", {
        email,
        password,
      });

      if (res.data?.error) {
        throw new Error(res.data.error.message);
      }

      // 2️⃣ Verify session
      const sessionRes = await apiClient.get("/auth/get-session");

      if (!sessionRes.data?.user) {
        throw new Error("Failed to establish session");
      }

      toast.success("Login successful!");
      navigate("/bug/list");
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center repeatingBackground dark">
      <FieldContent className="w-full max-w-md p-6 rounded-lg shadow-md bg-card text-card-foreground border-2 border-pink-950">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <div className="flex items-center mb-4">
              <img
                className="w-15 h-15 animationWiggle invert"
                src="/bug-svgrepo-com.svg"
                alt="Login"
              />
              <FieldDescription className="ml-4 text-2xl">
                Let's Debug.
              </FieldDescription>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="user@email.com"
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {error && <FieldError>{error}</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 p-2 rounded bg-primary text-primary-foreground hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 mx-4 rounded-full flex justify-center items-center p-2 bg-muted">
          <p className="mr-2">Not a user?</p>
          <Link className="text-blue-500" to="/register">
            Register
          </Link>
        </div>
      </FieldContent>
    </div>
  );
}

export default LoginForm;
