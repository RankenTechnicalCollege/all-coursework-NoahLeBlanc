import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import { toast } from "react-toastify";
import axios from "axios";
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

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

function RegisterForm() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const passwordsMatch = password === confirmPassword;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Email validation

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords must match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null); // Reset error
    setIsSubmitting(true);

    try {
      const response = await apiClient.post("/auth/sign-up/email", {
        email,
        password,
      });

      if (response.data?.success) {
        toast.success("Registration successful! Redirecting to login...");
        navigate("/login");
      } else {
        throw new Error("Registration failed.");
      }
    } catch (err: any) {
      console.error(err); // Log the error to check its structure
      const message =
        err.response?.data?.message || err.message || "Registration failed.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center repeatingBackground dark">
      <FieldContent className="w-full max-w-md p-6 rounded-lg shadow-md bg-card text-card-foreground border-2 border-pink-950">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            {/* Header */}
            <div className="flex items-center mb-4">
              <img
                className="w-15 h-15 animationWiggle invert"
                src="/bug-svgrepo-com.svg"
                alt="Signup"
              />
              <FieldDescription className="ml-4 text-2xl">
                Let's get your debugging journey started!
              </FieldDescription>
            </div>

            {/* Form Fields */}
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
                {error && error.includes("email") && <FieldError>{error}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {error && error.includes("password") && <FieldError>{error}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {error && error.includes("Passwords") && <FieldError>{error}</FieldError>}
              </Field>
            </FieldGroup>

            {/* Error Message */}
            {error && !error.includes("passwords") && <FieldError className="mt-2">{error}</FieldError>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password || !passwordsMatch || !isValidEmail}
              className="w-full mt-4 p-2 rounded bg-primary text-primary-foreground hover:opacity-90"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </FieldSet>
        </form>

        {/* Link to Login */}
        <div className="mt-5 mx-4 rounded-full flex justify-center items-center p-2 bg-muted">
          <p className="mr-2">Already a user?</p>
          <Link className="text-blue-500" to="/login">
            Login
          </Link>
        </div>
      </FieldContent>
    </div>
  );
}

export default RegisterForm;
