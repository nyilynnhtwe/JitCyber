"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Topbar({
  setMobileMenuOpen,
}: {
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Navigation items
  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/topics", label: "Topics" },
    { href: "/dashboard/admin/leaderboard", label: "Leaderboard" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 z-20">
      {/* Top Section - Logo and User Controls */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            className="text-gray-600 md:hidden mr-4"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo and app name */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-1 rounded-lg">
              <Image
                src="/chibi.svg"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">
              JitCyber Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
            >
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-30">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Navigation Tabs */}
      <div className="border-t border-gray-100 px-4">
        <div className="flex space-x-6 overflow-x-auto py-2 hide-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-2 px-1 text-sm font-medium transition-colors whitespace-nowrap ${pathname === item.href
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}