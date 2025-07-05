import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { 
      href: "/dashboard/admin", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      href: "/dashboard/admin/users", 
      label: "Users", 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      href: "/dashboard/admin/topics", 
      label: "Topics", 
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      href: "/dashboard/admin/settings", 
      label: "Settings", 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 min-h-screen hidden md:flex flex-col">
      <div className="p-5 flex items-center gap-3 border-b border-gray-700">
        <div className="bg-indigo-600 rounded-lg p-2">
          <Image
            src="/chibi.svg"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold">JitCyber Admin</span>
      </div>

      <div className="p-4 mt-4 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}