"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from '@/app/components/Footer';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { Menu, X, LogOut, BookOpen, ClipboardList, Mail, Key, Trophy, ChevronRight, User, HelpCircle, Home } from 'lucide-react';
import enData from '../../data/en.json';
import thData from '../../data/th.json';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Chatbot } from '@/app/components/Chatbot';
import { AnimatePresence, motion } from 'framer-motion';

export default function LoggedInHome() {
    const { data: session, status } = useSession();
    const { locale } = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [activeFeature, setActiveFeature] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [score, setScore] = useState<number>(0);
    const [rank, setRank] = useState<number>(0);

    const t = locale === 'th' ? thData : enData;

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        signOut({ callbackUrl: "/" });
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLogoutConfirm(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Handle clicks outside profile dropdown
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await fetch('/api/leaderboard');
                if (!res.ok) throw new Error('Failed to fetch leaderboard');

                const data = await res.json();
                const players = data.players;
                const userIndex = players.findIndex(p => p.userId === session.user.id);
                if (userIndex !== -1) {
                    setScore(players[userIndex].score);
                    setRank(userIndex + 1); // rank is index + 1
                }
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            }
        };

        fetchLeaderboard();
    }, [session?.user?.id]);


    // Dashboard features data
    const features = [
        {
            id: 'learn',
            title: locale === 'th' ? 'เรียนรู้' : 'Learn',
            icon: <BookOpen className="w-6 h-6" />,
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            description: locale === 'th' ? 'สำรวจบทเรียนของคุณ' : 'Explore your learning modules.'
        },
        {
            id: 'email_detector',
            title: locale === 'th' ? 'ตรวจสอบอีเมล' : 'Email Detector',
            icon: <Mail className="w-6 h-6" />,
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            description: locale === 'th' ? 'ระบุอีเมลที่ไม่ปลอดภัยหรือปลอมแปลง' : 'Identify unsafe or fake emails.'
        },
        {
            id: 'password_strength_checker',
            title: locale === 'th' ? 'ความแข็งแรงของรหัสผ่าน' : 'Password Checker',
            icon: <Key className="w-6 h-6" />,
            color: 'bg-amber-500',
            hoverColor: 'hover:bg-amber-600',
            description: locale === 'th' ? 'ตรวจสอบรหัสผ่านของคุณว่าแข็งแรงแค่ไหน' : 'Check how strong your password is.'
        },
        {
            id: 'leaderboard',
            title: locale === 'th' ? 'กระดานผู้นำ' : 'Leaderboard',
            icon: <Trophy className="w-6 h-6" />,
            color: 'bg-rose-500',
            hoverColor: 'hover:bg-rose-600',
            description: locale === 'th' ? 'ดูอันดับของคุณในกระดานผู้นำ' : 'View your ranking on the leaderboard.'
        },
    ];

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{t.appName} - Dashboard</title>
                <meta name="description" content="Logged in dashboard view" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">

                <motion.header
                    className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled
                        ? "bg-white/90 backdrop-blur-md py-3 shadow-md"
                        : "bg-white py-5"
                        }`}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-1 flex items-center justify-center w-12 h-12">
                                <Image
                                    src="/Logo.svg"
                                    width={40}
                                    height={40}
                                    alt="Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <motion.span
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                                whileHover={{ scale: 1.05 }}
                            >
                                {t.appName}
                            </motion.span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard/user"
                                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                <span>{locale === 'th' ? "แดชบอร์ด" : "Dashboard"}</span>
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    className="flex items-center gap-2 group"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="bg-blue-100 rounded-full p-1 group-hover:bg-blue-200 transition-colors">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                                        {session?.user?.fullname || "User"}
                                    </span>
                                </button>

                                {/* Profile Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <Link
                                                href="/profile"
                                                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-left"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <User className="w-4 h-4 text-gray-500" />
                                                {locale === 'th' ? "โปรไฟล์" : "Profile"}
                                            </Link>
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-left"
                                                onClick={handleLogoutClick}
                                            >
                                                <LogOut className="w-4 h-4 text-gray-500" />
                                                {locale === 'th' ? "ออกจากระบบ" : "Logout"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Navigation */}
                        <div className="md:hidden flex items-center gap-4">
                            <LanguageSwitcher />
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Menu"
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </motion.header>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        ref={menuRef}
                        className="md:hidden fixed top-16 right-0 bg-white w-64 h-full z-40 shadow-xl animate-slide-in-right"
                    >
                        <div className="flex flex-col py-4">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                    <div>
                                        <p className="font-medium text-slate-800">{session?.user?.fullname || 'User'}</p>
                                        {/* <p className="text-sm text-slate-500">{session?.user?.email || 'user@example.com'}</p> */}
                                    </div>
                                </div>
                            </div>

                            <nav className="flex flex-col py-2">
                                <Link
                                    href="/dashboard/user"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-6 py-3 flex items-center text-slate-700 hover:bg-slate-50"
                                >
                                    <ChevronRight className="w-4 h-4 mr-3 text-slate-400" />
                                    {locale === 'th' ? 'แดชบอร์ด' : 'Dashboard'}
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-6 py-3 flex items-center text-slate-700 hover:bg-slate-50"
                                >
                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                    {locale === 'th' ? 'โปรไฟล์' : 'Profile'}
                                </Link>
                                <Link
                                    href="/help"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-6 py-3 flex items-center text-slate-700 hover:bg-slate-50"
                                >
                                    <HelpCircle className="w-4 h-4 mr-3 text-slate-400" />
                                    {locale === 'th' ? 'ช่วยเหลือ' : 'Help'}
                                </Link>
                                <Link
                                    href="/logout"
                                    onClick={handleLogoutClick}
                                    className="px-6 py-3 flex items-center text-red-500 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    {locale === 'th' ? 'ออกจากระบบ' : 'Logout'}
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Logout Confirmation Modal */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-scale-in">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                {locale === 'th' ? 'ยืนยันการออกจากระบบ' : 'Confirm Logout'}
                            </h3>
                            <p className="text-slate-600 mb-6">
                                {locale === 'th'
                                    ? 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?'
                                    : 'Are you sure you want to logout?'}
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleCancelLogout}
                                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    {locale === 'th' ? 'ยกเลิก' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    {locale === 'th' ? 'ออกจากระบบ' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <main className="flex-grow pt-24 pb-12 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                        {locale === 'th' ? 'ยินดีต้อนรับกลับ!' : 'Welcome back!'}, {session?.user?.fullname || 'User'}
                                    </h1>
                                    <p className="text-blue-100">
                                        {locale === 'th'
                                            ? 'เริ่มต้นการเดินทางสู่ความปลอดภัยทางไซเบอร์ของคุณวันนี้'
                                            : 'Start your cybersecurity journey today'}
                                    </p>
                                </div>
                                <div className="bg-slate-200 border-2 border-dashed rounded-xl w-16 h-16 md:w-20 md:h-20" />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">{locale === 'th' ? 'คะแนน' : 'Scores'}</p>
                                <p className="text-xl font-bold">{score}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">{locale === 'th' ? 'อันดับ' : 'Rank'}</p>
                                <p className="text-xl font-bold">#{rank}</p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">
                                {locale === 'th' ? 'เครื่องมือของคุณ' : 'Your Tools'}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {features.map((feature) => (
                                    <Link
                                        key={feature.id}
                                        href={`/dashboard/user/${feature.id}`}
                                        className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-blue-200 relative overflow-hidden group`}
                                        onMouseEnter={() => setActiveFeature(feature.id)}
                                        onMouseLeave={() => setActiveFeature(null)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`${feature.color} p-3 rounded-lg text-white`}>
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`absolute bottom-0 left-0 w-full h-1 ${feature.hoverColor} transition-all duration-300 ${activeFeature === feature.id ? 'h-1.5' : 'h-0.5'}`}></div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {locale === 'th' ? 'กิจกรรมล่าสุด' : 'Recent Activity'}
                                </h2>
                                <Link href="/dashboard/activity" className="text-blue-600 text-sm hover:underline">
                                    {locale === 'th' ? 'ดูทั้งหมด' : 'View all'}
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <Trophy className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {locale === 'th' ? 'ได้รับความสำเร็จ "ผู้เริ่มต้นด้านความปลอดภัย"' : 'Earned "Security Beginner" achievement'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {locale === 'th' ? 'เมื่อ 2 ชั่วโมงที่แล้ว' : '2 hours ago'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {locale === 'th' ? 'บทเรียนที่เสร็จสิ้น: การรับรู้ฟิชชิ่ง' : 'Completed lesson: Phishing Awareness'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {locale === 'th' ? 'เมื่อวานนี้' : 'Yesterday'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <ClipboardList className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {locale === 'th' ? 'ทำแบบทดสอบ: ความปลอดภัยของรหัสผ่าน' : 'Completed quiz: Password Security'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {locale === 'th' ? '2 วันที่แล้ว' : '2 days ago'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="bg-white border-t border-slate-200 py-6">
                    <Footer t={t} locale={locale} />
                </footer>

                {/* Chatbot component */}
                <Chatbot />
            </div>
        </>
    );
}