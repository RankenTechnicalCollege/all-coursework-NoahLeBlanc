// src/components/RegisterForm.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";

// Axios client with credentials (important!)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:2023/api",
  withCredentials: true,
});

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Password validation
  const passwordsMatch = password === reEnterPassword;
  const showPasswordError = reEnterPassword.length > 0 && !passwordsMatch;

  // -------------------- Email Sign Up --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!passwordsMatch) {
      setError("Passwords must match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      // Clear any existing session first
      try {
        await apiClient.post("/auth/sign-out");
        // Also clear cookies manually
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
      } catch {
        // Ignore if no session exists
      }

      // Small delay to ensure session is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      const res = await apiClient.post("/auth/sign-up/email", {
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });

      // Check for errors in response
      if (res.data?.error) {
        throw new Error(res.data.error.message || "Sign up failed");
      }

      // Verify session is established
      const sessionRes = await apiClient.get("/auth/get-session");

      if (!sessionRes.data?.user) {
        throw new Error("Failed to establish session");
      }

      // Successfully signed up
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Sign up failed:", err);
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err.message ||
        "Sign up failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Google Sign Up --------------------
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/auth/sign-in/social", {
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (res.data?.url) {
        // Redirect to Google OAuth
        window.location.href = res.data.url;
        return;
      }

      throw new Error(res.data?.error?.message || "Google sign-up failed");
    } catch (err: any) {
      console.error("Google sign-up failed:", err);
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err.message ||
        "Google sign-up failed. Please try again.";
      setError(errorMessage);
      setGoogleLoading(false);
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <img
                className="w-10 h-10"
                src="/login-3-svgrepo-com.svg"
                alt="Signup Symbol"
              />
              <FieldDescription className="text-2xl font-semibold text-gray-800">
                Let's get shopping.
              </FieldDescription>
            </div>

            {/* Inputs */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="reEnterPassword">
                  Re-enter Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="reEnterPassword"
                    type={showRePassword ? "text" : "password"}
                    value={reEnterPassword}
                    onChange={(e) => setReEnterPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    tabIndex={-1}
                  >
                    {showRePassword ? "Hide" : "Show"}
                  </button>
                </div>
                {showPasswordError && (
                  <FieldError className="mt-1">
                    Passwords must match.
                  </FieldError>
                )}
              </Field>
            </FieldGroup>

            {/* Error */}
            {error && (
              <FieldError className="mt-2 text-sm text-red-600">
                {error}
              </FieldError>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                !email ||
                !firstName ||
                !lastName ||
                !password ||
                !passwordsMatch
              }
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </FieldSet>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full p-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {googleLoading ? "Redirecting..." : "Sign up with Google"}
        </button>

        {/* Footer */}
        <div className="bg-gray-100 mt-6 p-3 rounded-lg flex justify-center items-center">
          <p className="text-gray-700 mr-2">Already a user?</p>
          <Link
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;