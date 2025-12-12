//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-7xl font-bold text-gray-800">404</h1>

      <p className="text-xl text-gray-600 mt-4">
        Oops… the page you're looking for doesn’t exist.
      </p>

      <Button
        className="mt-6"
        asChild
      >
        <Link className="text-blue-500" to="/RegisterForm">Return Home</Link>
      </Button>
    </div>
  )
}
