
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from '@/app/components/Footer';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { Menu, X, LogOut } from 'lucide-react';
import enData from '../../data/en.json';
import thData from '../../data/th.json';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Chatbot } from '@/app/components/Chatbot';


export default function LoggedInHome() {
    const { locale } = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const t = locale === 'th' ? thData : enData;


    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default link behavior

        signOut({ callbackUrl: "/" });
    };

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
                <title>{t.appName} - Dashboard</title>
                <meta name="description" content="Logged in dashboard view" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
                {/* Header */}
                <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm py-3 border-b border-slate-200">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Image src="/Logo.svg" width={40} height={40} alt="Logo" className="mr-2" />
                            <div className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                                {t.appName}
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/profile" className="text-slate-700 hover:text-blue-600 font-medium">
                                Profile
                            </Link>
                            <a
                                href="/logout"
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </a>
                            <LanguageSwitcher />
                        </nav>

                        {/* Mobile Navigation */}
                        <div className="md:hidden flex items-center gap-4">
                            <LanguageSwitcher />
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white/95 py-4 shadow-lg">
                            <nav className="flex flex-col space-y-4 px-4">
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                <Link href="/logout" className="text-red-500" onClick={() => setIsMenuOpen(false)}>Logout</Link>
                            </nav>
                        </div>
                    )}
                </header>

                {/* Content */}
                <main className="flex-grow pt-28 pb-12 container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">
                        {locale === 'th' ? 'ยินดีต้อนรับกลับ!' : 'Welcome back!'}
                    </h1>
                    <p className="text-slate-600 text-lg mb-6">
                        {locale === 'th' ? 'นี่คือแดชบอร์ดของคุณ' : 'This is your personalized dashboard.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/dashboard/user/learn" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200">
                            <h2 className="text-xl font-semibold mb-2">📚 {locale === 'th' ? 'เรียนรู้' : 'Learn'}</h2>
                            <p className="text-slate-500 text-sm">{locale === 'th' ? 'สำรวจบทเรียนของคุณ' : 'Explore your learning modules.'}</p>
                        </Link>

                        <Link href="/dashboard/user/quizzes" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200">
                            <h2 className="text-xl font-semibold mb-2">📝 {locale === 'th' ? 'แบบทดสอบ' : 'Quizzes'}</h2>
                            <p className="text-slate-500 text-sm">{locale === 'th' ? 'ทดสอบความรู้ของคุณ' : 'Test your knowledge with quizzes.'}</p>
                        </Link>

                        <Link href="/dashboard/user/email_detector" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200">
                            <h2 className="text-xl font-semibold mb-2">📧 {locale === 'th' ? 'ตรวจสอบอีเมล' : 'Email Detector'}</h2>
                            <p className="text-slate-500 text-sm">{locale === 'th' ? 'ระบุอีเมลที่ไม่ปลอดภัยหรือปลอมแปลง' : 'Identify unsafe or fake emails.'}</p>
                        </Link>

                        <Link href="/dashboard/user/password_strength_checker" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200">
                            <h2 className="text-xl font-semibold mb-2">🔐 {locale === 'th' ? 'ความแข็งแรงของรหัสผ่าน' : 'Password Checker'}</h2>
                            <p className="text-slate-500 text-sm">{locale === 'th' ? 'ตรวจสอบรหัสผ่านของคุณว่าแข็งแรงแค่ไหน' : 'Check how strong your password is.'}</p>
                        </Link>

                        <Link href="/dashboard/user/leaderboard" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200">
                            <h2 className="text-xl font-semibold mb-2">🏆 {locale === 'th' ? 'กระดานผู้นำ' : 'Leaderboard'}</h2>
                            <p className="text-slate-500 text-sm">{locale === 'th' ? 'ดูอันดับของคุณในกระดานผู้นำ' : 'View your ranking on the leaderboard.'}</p>
                        </Link>
                    </div>

                </main>

                <footer className="bg-white border-t border-slate-200 py-6">
                    <Footer t={t} locale={locale} />
                </footer>
                {/* Chatbot component here */}
                <Chatbot />
            </div>
        </>
    );
}

