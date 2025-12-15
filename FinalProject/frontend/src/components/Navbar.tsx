//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
//|====================================================================================================|
//|-----------------------------------------------[-Main-]---------------------------------------------|
//|====================================================================================================|
function Navbar() {
  return (
    <div className="w-full m-0 p-0">
      <NavigationMenu className="!m-0 w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/users"
                className="flex flex-row items-center gap-3 px-6 py-4 text-lg"
              >
                <img
                  src="users-svgrepo-com.svg"
                  alt="Users"
                  className="h-6 w-6"
                />
                <span>Users</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/products"
                className="flex flex-row items-center gap-3 px-6 py-4 text-lg"
              >
                <img
                  src="pricetag-alt-svgrepo-com.svg"
                  alt="Products"
                  className="h-6 w-6"
                />
                <span>Products</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
export default Navbar