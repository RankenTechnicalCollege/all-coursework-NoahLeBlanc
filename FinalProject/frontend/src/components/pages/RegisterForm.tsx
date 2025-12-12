import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
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

// Zod schema
const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
      } else {
        toast.success(result.message || "User registered successfully!");
        reset();
      }
    } catch {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FieldContent className="w-full max-w-md p-6 bg-gray-300 rounded-lg shadow-md">
        <FieldSet>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10"
              src="/login-3-svgrepo-com.svg"
              alt="Login Symbol"
            />
            <FieldDescription className="ml-4 text-2xl">
              Let's get your debugging journey started!
            </FieldDescription>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email:</FieldLabel>
                <Input
                  id="email"
                  placeholder="User@email.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password:</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password:</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </FieldSet>

        <div className="bg-gray-300 mt-5 mx-4 rounded-full flex justify-center items-center p-2">
          <p className="mr-2">Already a user?</p>
          <a href="/login" className="text-blue-500">Login</a>
        </div>
      </FieldContent>
    </div>
  );
}

export default RegisterForm;
