"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Topbar({
  activeTab,
  setMobileMenuOpen,
}: {
  activeTab: string;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow z-20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="text-gray-600 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 capitalize tracking-wide">
            {activeTab.replace(/-/g, " ") || "Dashboard"}
          </h2>
        </div>

        <div className="flex items-center gap-6 relative">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <div className="bg-blue-100 p-1.5 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-200 z-30">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}