import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut,
  ClipboardList
} from "lucide-react";

export default function Sidebar({ 
  activeTab, 
  setActiveTab,
  handleLogout
}: { 
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "User Management" },
    { id: "quizzes", icon: ClipboardList, label: "Quiz Management" },
    { id: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="hidden lg:flex w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex-col">
      <div className="p-5 flex items-center space-x-3 border-b border-blue-700">
        <ShieldCheck className="w-8 h-8" />
        <h1 className="text-xl font-bold">JitCyber Admin</h1>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center w-full px-6 py-3 text-left ${
              activeTab === item.id
                ? "bg-blue-700 border-l-4 border-cyan-400"
                : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button
          className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-700 rounded"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}