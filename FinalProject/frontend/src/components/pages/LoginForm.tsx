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
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center repeatingBackground" >
      <FieldContent className="w-full max-w-md p-6 bg-gray-300 rounded-lg shadow-md">
        <FieldSet>
          <div className="flex items-center mb-4">
            <img
              className="w-15 h-15 animationWiggle"
              src="/bug-svgrepo-com.svg"
              alt="Login Symbol"
            />
            <FieldDescription className="ml-4 text-2xl">Let's Debug.</FieldDescription>
          </div>
          <FieldGroup>
            <Field className="">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" autoComplete="off" className="border-solid border-gray-500" placeholder="User@email.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" className="border-solid border-gray-500" autoComplete="off" aria-invalid="false" />
              <FieldError className="hidden">Invalid Email or Password.</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
        <div className="bg-gray-300 mt-5 mx-4 rounded-full flex justify-center items-center p-2">
          <p className="mr-2">Not a user?</p>
          <Link className="text-blue-500" to="/RegisterForm">Register</Link>
        </div>
      </FieldContent>
    </div>
  )
}
export default LoginForm;
