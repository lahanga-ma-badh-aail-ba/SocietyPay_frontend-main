import { 
Building2, 
User, 
// Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";

// interface HeaderProps {
//   userName?: string;
//   flatNumber?: string;
// }

//{ userName = "Resident", flatNumber = "A-101" }: HeaderProps

const Header = () => {
  const { user } = useAuth();

    
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Brand */}
        
        <Link to="/">
          <Button variant="default">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Building2 className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-semibold text-primary-foreground">SocietyPay</h1>
              </div>
            </div>
          </Button>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Bell className="h-5 w-5" />
          </Button> */}
          {/* {user && (
            <div className="items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/10">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome back {user.name}!</span>
            </div>
          )} */}
          {user && (
          <div className="flex items-center gap-2 px-1 py-1 rounded-lg ">
            <span className="text-sm font-medium">
              <span className="sm:hidden">{user.name}</span>
              <span className="hidden sm:inline">Welcome back {user.name}!</span>
            </span>
          </div>
          )}
          {/* <Link to="/inbox">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Mail className="h-5 w-5" />
            </Button>
          </Link> */}
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;