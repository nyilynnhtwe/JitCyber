"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Lock, Zap, ChevronRight, Menu, X, UserRoundPen } from 'lucide-react';

// Import localization data
import enData from './data/en.json';
import thData from './data/th.json';
import Link from 'next/link';

export default function Home() {
  const { locale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Select the correct localization data
  const t = locale === 'th' ? thData : enData;


  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>{t.appName} - {t.hero.title}</title>
        <meta name="description" content={t.hero.subtitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header */}
        <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm py-3 border-b border-slate-200">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image width={100} height={100} src="/Logo.svg" alt="Logo" className="w-10 h-10 mr-3" />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                {t.appName}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {Object.values(t.nav).map((item, index) => (
                <a
                  key={index}
                  href={Object.keys(t.nav)[index]}
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center group relative"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
              ))}
              <LanguageSwitcher />
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                className="text-slate-700 hover:text-blue-600 focus:outline-none transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm py-4 shadow-lg border-b border-slate-200">
              <nav className="container mx-auto px-4 flex flex-col space-y-3">
                {Object.values(t.nav).map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-slate-700 hover:text-blue-600 transition-colors py-2 font-medium flex items-center border-b border-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                    <ChevronRight className="w-4 h-4 ml-2 text-slate-400" />
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="pt-35 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 text-slate-600 max-w-2xl">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/learn">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center gap-2">
                      {t.hero.cta1}
                      <Zap className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex items-center justify-center shadow-xl">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-400 rounded-full opacity-80 mix-blend-multiply animate-float"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-400 rounded-full opacity-80 mix-blend-multiply animate-float-delay"></div>
                    <div className="bg-white rounded-2xl p-6 relative z-10 shadow-xl border border-slate-200">
                      <div className="flex justify-between mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        </div>
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {locale === 'th' ? 'ปลอดภัย 100%' : '100% Secure'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {locale === 'th' ? 'ความรู้ด้านความปลอดภัยไซเบอร์' : 'Cybersecurity Knowledge'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>






        {/* CTA Section */}
        <section className="relative py-12 md:py-25 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
          {/* Background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-overlay blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-overlay blur-xl"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay blur-xl"></div>
          </div>

          {/* Added Rectangle Grid texture */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIwIDB2NDBNMCAyMGg0MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="mt-5 mb-6 text-4xl md:text-4xl font-bold animate-fade-in">
                {t.cta.title}
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
                {t.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/signup"
                  className="bg-white text-blue-700 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-slate-300 transition-all text-lg flex items-center justify-center gap-2"
                >
                  {t.cta.button1}
                  <ChevronRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/signin"
                  className="bg-transparent border-2 border-white/50 px-8 py-3 rounded-lg font-medium hover:border-white hover:bg-white/10 transition-all text-lg flex items-center justify-center gap-2"
                >
                  {t.cta.button2}
                  <UserRoundPen className="w-5 h-5" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer t={t} locale={locale} />
      </div>
    </>
  );
}