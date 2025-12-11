/*
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
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function LoginForm(){
    return(
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-md">
                <FieldSet>
                    <div className="flex">
                        <img className="w-10 h-10" src="../../public/login-3-svgrepo-com.svg" alt="Login Symbol" />
                        <FieldDescription className="ml-19 text-2xl">Let's get shopping.</FieldDescription>
                    </div>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Email</FieldLabel>
                            <Input id="name" autoComplete="off" placeholder="User@email.com" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="username">Password</FieldLabel>
                            <Input id="username" autoComplete="off" aria-invalid />
                            <FieldError>Invalid Email or Password.</FieldError>
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <div className="bg-gray-300 mt-5 mx-30 rounded-4xl flex justify-center">
                    <p className="mr-5">Not a user?</p>
                    <a href="" className="text-blue-500">Sign up</a>
                </div>
            </div>
        </div>
        </>
    )
}
export default LoginForm;

*/