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

//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function RegisterForm() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-md">
        <FieldSet>
          <div className="flex items-center gap-3 mb-4">
            <img
              className="w-10 h-10"
              src="/login-3-svgrepo-com.svg"
              alt="Signup Symbol"
            />
            <FieldDescription className="text-2xl font-semibold">
              Let's get shopping.
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
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                autoComplete="off"
                placeholder="John"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                autoComplete="off"
                placeholder="Doe"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="off"
              />

              <FieldLabel htmlFor="reEnterPassword" className="mt-2">
                Re-enter Password
              </FieldLabel>
              <Input
                id="reEnterPassword"
                type="password"
                autoComplete="off"
              />

              {/* Replace this later with real validation */}
              <FieldError>Passwords must match.</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* SIGN UP PAGE FOOTER */}
        <div className="bg-gray-300 mt-5 p-3 rounded-xl flex justify-center">
          <p className="mr-2">Already a user?</p>
          <a href="/login" className="text-blue-500 font-medium">Login</a>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
