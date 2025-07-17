import { Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeView: string;
}

export function Sidebar({ activeView }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Clients", path: "/clients" },
  ];

  const handleViewChange = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Wellness Platform</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleViewChange(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
