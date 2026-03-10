import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// interface HeaderProps {
//   userName?: string;
//   flatNumber?: string;
// }

//{ userName = "Resident", flatNumber = "A-101" }: HeaderProps

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Building2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-primary-foreground">SocietyPay</h1>
            {/* <p className="text-xs text-primary-foreground/70">Flat {flatNumber}</p> */}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Bell className="h-5 w-5" />
          </Button> */}
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