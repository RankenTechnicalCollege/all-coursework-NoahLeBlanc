import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bug, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bug className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">BugTracker</span>
            </div>
            
            <div className="flex gap-2">
              <Link to="/">
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  className={cn(
                    "font-medium",
                    location.pathname === "/" && "bg-primary text-primary-foreground"
                  )}
                >
                  <Bug className="mr-2 h-4 w-4" />
                  Bugs
                </Button>
              </Link>
              <Link to="/users">
                <Button
                  variant={location.pathname === "/users" ? "default" : "ghost"}
                  className={cn(
                    "font-medium",
                    location.pathname === "/users" && "bg-primary text-primary-foreground"
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
