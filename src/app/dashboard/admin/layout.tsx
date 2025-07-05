"use client";
import MobileMenu from "@/app/components/admin/MobileMenu";
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
      <Topbar setMobileMenuOpen={setMobileMenuOpen} />

      {mobileMenuOpen && (
        <MobileMenu setMobileMenuOpen={setMobileMenuOpen} />
      )}

      <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {children}
        </div>
      </main>

      <Footer t={t} locale={locale} />
    </div>
  );
}