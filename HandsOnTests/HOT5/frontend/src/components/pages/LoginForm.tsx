//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";

//|====================================================================================================|
//|----------------------------------------------[-Main-]----------------------------------------------|
//|====================================================================================================|
function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-md">
        <FieldSet>
          <div className="flex items-center gap-3 mb-4">
            <img
              className="w-10 h-10"
              src="/login-3-svgrepo-com.svg"
              alt="Login Symbol"
            />
            <FieldDescription className="text-2xl font-semibold">
              Welcome back.
            </FieldDescription>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="user@email.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="off"
              />
              {/* Replace with real validation later */}
              <FieldError>Invalid email or password.</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="bg-gray-300 mt-5 p-3 rounded-xl flex justify-center">
          <p className="mr-2">Not a user?</p>
          <Link className="text-blue-500" to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
export default LoginForm
