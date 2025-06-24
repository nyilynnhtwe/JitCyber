import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ClipboardList 
} from "lucide-react";

export default function MobileMenu({ 
  activeTab, 
  setActiveTab,
  setMobileMenuOpen
}: { 
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "quizzes", icon: ClipboardList, label: "Quizzes" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="lg:hidden bg-white shadow-md">
      <div className="grid grid-cols-4 gap-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center p-3 rounded ${
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab(item.id);
              setMobileMenuOpen(false);
            }}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}