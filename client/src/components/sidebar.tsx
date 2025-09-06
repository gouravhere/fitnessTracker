import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  BarChart3, 
  Settings,
  LogOut,
  User
} from "lucide-react";
import { removeAuthToken } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export function Sidebar() {
  const [location] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const handleLogout = () => {
    removeAuthToken();
    window.location.reload();
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/workouts", icon: Dumbbell, label: "Workouts" },
    { path: "/meals", icon: Utensils, label: "Meals & Diet" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:translate-x-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="ml-3 text-xl font-bold text-foreground">FitTracker Pro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <a 
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-foreground">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground">Premium Member</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
