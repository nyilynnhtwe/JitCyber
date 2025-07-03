"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Lock, Zap, ChevronRight, Menu, X, UserRoundPen, ShieldCheck, ArrowRight } from 'lucide-react';

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
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .float-animation { animation: float 4s ease-in-out infinite; }
          .float-delay { animation: float 4s ease-in-out infinite 1s; }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25);
          }
        `}</style>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header */}
        <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm py-3 border-b border-slate-200">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Image width={100} height={100} src="/Logo.svg" alt="Logo" className="w-10 h-10 mr-3" />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {t.appName}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {Object.values(t.nav).map((item, index) => {
                const key = Object.keys(t.nav)[index];
                const href = key === "home" ? "/" : key;

                return (
                  <a
                    key={index}
                    href={href}
                    className="text-slate-700 hover:text-blue-600 transition-colors font-medium flex items-center group relative"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all group-hover:w-full"></span>
                  </a>
                );
              })}
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
        <section className="pt-40 pb-16 md:pt-36 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-5 text-slate-800 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-slate-600 max-w-2xl">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signin">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 group">
                      {t.hero.cta1}
                      <Zap className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-300 rounded-full opacity-80 mix-blend-multiply float-animation"></div>
                    <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-emerald-300 rounded-full opacity-80 mix-blend-multiply float-delay"></div>
                    <div className="bg-white rounded-2xl p-6 relative z-10 shadow-xl border border-slate-200/80 card-hover">
                      <div className="flex justify-between mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                            <Lock className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 mb-1">
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
        <section className="relative py-20 md:py-28 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
          {/* Background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-overlay blur-xl float-animation"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-overlay blur-xl float-delay"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay blur-xl float-animation"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t.cta.title}
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
                {t.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/signup"
                  className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-100 transition-all text-lg flex items-center justify-center gap-2 group"
                >
                  {t.cta.button1}
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/signin"
                  className="bg-transparent border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:border-white hover:bg-white/10 transition-all text-lg flex items-center justify-center gap-2 group"
                >
                  {t.cta.button2}
                  <UserRoundPen className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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