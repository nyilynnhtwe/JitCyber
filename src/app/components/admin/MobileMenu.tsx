"use client";
import Link from "next/link";
import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users as UsersIcon, 
  BookOpen,
  Settings
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function MobileMenu({
  setMobileMenuOpen,
}: {
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const navItems = [
    { 
      href: "/dashboard/admin", 
      label: "Dashboard", 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      href: "/dashboard/admin/users", 
      label: "Users", 
      icon: <UsersIcon className="w-5 h-5" /> 
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
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Menu panel */}
      <div className="relative bg-white w-80 min-h-full shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Image
                src="/chibi.svg"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-800">JitCyber Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}