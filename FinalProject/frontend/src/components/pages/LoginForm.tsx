//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and Password are required.");
      toast.error("Email and Password are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/bug/list");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center repeatingBackground dark">
      {/* Use CSS variable-based colors instead of bg-gray-300 */}
      <FieldContent className="w-full max-w-md p-6 rounded-lg shadow-md bg-card text-card-foreground dark:bg-card dark:text-card-foreground border-2 border-pink-950">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <div className="flex items-center mb-4">
              <img
                className="w-15 h-15 animationWiggle invert"
                src="/bug-svgrepo-com.svg"
                alt="Login Symbol"
              />
              <FieldDescription className="ml-4 text-2xl">Let's Debug.</FieldDescription>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="border-solid border-border bg-input text-foreground dark:bg-input dark:text-foreground"
                  placeholder="User@email.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-solid border-border bg-input text-foreground dark:bg-input dark:text-foreground"
                  autoComplete="off"
                  aria-invalid={!!error}
                />
                {error && <FieldError>{error}</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>

          <button
            type="submit"
            className="w-full mt-4 p-2 rounded bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground hover:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 mx-4 rounded-full flex justify-center items-center p-2 bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground">
          <p className="mr-2">Not a user?</p>
          <Link className=" text-blue-500" to="/register">Register</Link>
        </div>
      </FieldContent>
    </div>
  );
}

export default LoginForm 