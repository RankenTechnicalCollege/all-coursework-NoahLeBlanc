import { Bug } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BugTracker</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm hover:text-primary transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm hover:text-primary transition-colors">
            About
          </a>
          <a href="#Contact" className="text-sm hover:text-primary transition-colors">
            Contact 
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
