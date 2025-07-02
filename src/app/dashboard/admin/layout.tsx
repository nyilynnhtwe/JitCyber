"use client";
import MobileMenu from "@/app/components/admin/MobileMenu";
import Sidebar from "@/app/components/admin/SideBar";
import Topbar from "@/app/components/admin/TopBar";
import Footer from "@/app/components/Footer";
import { useLocale } from "@/context/LocalContext";

import enData from "@/app/data/en.json";
import thData from "@/app/data/th.json";
import { useState } from "react";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const t = locale === 'th' ? thData : enData;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <Topbar setMobileMenuOpen={setMobileMenuOpen} activeTab={""} />

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <MobileMenu
              setMobileMenuOpen={setMobileMenuOpen}
              activeTab={""}
              setActiveTab={() => {}}
            />
          )}

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
      
      {/* Fixed footer at bottom */}
      <Footer t={t} locale={locale} />
    </div>
  );
}