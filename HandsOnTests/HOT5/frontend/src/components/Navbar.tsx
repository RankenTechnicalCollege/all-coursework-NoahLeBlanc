import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

function Navbar() {
  // Logout using Better Auth's built-in sign-out endpoint
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:2023/api/auth/sign-out", {
        method: "POST",
        credentials: "include", // important for cookies
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Logout failed");
      }

      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed. Check console for details.");
    }
  };

  return (
    <div className="w-full m-0 p-0 bg-black mb-10 text-white">
      <div className="flex items-center justify-between w-full px-6">
        {/* Left side navigation links */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/users"
                  className="group flex flex-row items-center gap-3 py-4 text-lg"
                >
                  <img
                    src="/users-svgrepo-com.svg"
                    alt="Users"
                    className="h-6 w-6 invert group-hover:invert-0"
                  />
                  <span>Users</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/products"
                  className="group flex flex-row items-center gap-3 py-4 text-lg"
                >
                  <img
                    src="/pricetag-alt-svgrepo-com.svg"
                    alt="Products"
                    className="h-6 w-6 invert group-hover:invert-0"
                  />
                  <span>Products</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side account menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex flex-row items-center py-4 gap-2 [&>svg]:!hidden [&_svg]:!hidden">
                <img
                  src="/account-svgrepo-com.svg"
                  alt="Account"
                  className="h-9 w-9"
                />
                <span>Account</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent className="p-2">
                <ul className="flex flex-col gap-2 w-48">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/user/me"
                        className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                      >
                        My Profile
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export default Navbar;
