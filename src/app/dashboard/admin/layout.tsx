"use client";

import { useState } from "react";
import Sidebar from "@/app/components/admin/SideBar";
import Topbar from "@/app/components/admin/TopBar";
import MobileMenu from "@/app/components/admin/MobileMenu";
import Footer from "@/app/components/Footer";
import { useLocale } from "@/context/LocalContext";
import enData from '@/app/data/en.json';
import thData from '@/app/data/th.json';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const t = locale === 'th' ? thData : enData;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar inside content */}
          <Topbar setMobileMenuOpen={setMobileMenuOpen} activeTab={""} />

          {/* Optional mobile menu */}
          {mobileMenuOpen && (
            <MobileMenu
              setMobileMenuOpen={setMobileMenuOpen}
              activeTab={""}
              setActiveTab={() => {}}
            />
          )}

          {/* Scrollable content area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {children}
          </main>

          {/* Footer */}
          <Footer t={t} locale={""} />
        </div>
      </div>
    </div>
  );
}