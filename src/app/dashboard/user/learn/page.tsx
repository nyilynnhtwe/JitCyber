"use client";
import React, { useEffect, useState, useRef } from "react";
import {
    Shield,
    Eye,
    Key,
    Smartphone,
    ChevronRight,
    Award,
    BarChart2,
    Sparkles,
    BookOpen,
    Home,
    Globe,
    User,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ScoreEntry, Topic } from "@/types/user";

interface CourseCardProps {
    id: string;
    title: string;
    titleThai: string;
    description: string;
    descriptionThai: string;
    quizzesCount: number;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: (id: string) => void;
    color: string;
    isThai: boolean;
    hasTaken: boolean;
    score?: number;
}

function CourseCard({
    id,
    title,
    titleThai,
    description,
    descriptionThai,
    icon: Icon,
    isSelected,
    onSelect,
    color,
    accent,
    isThai,
    quizzesCount,
    hasTaken,
    score,
}: CourseCardProps & { accent: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    return (
        <div className="space-y-3 w-full">
            <motion.div
                className={`relative overflow-hidden bg-white border border-gray-200 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:border-gray-300"
                    }`}
                onClick={() => onSelect(id)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Content Container */}
                <div className="relative z-10 p-6">
                    <div className="flex items-start gap-4">
                        <motion.div
                            className={`p-3 rounded-xl ${color} shadow-md flex-shrink-0`}
                            animate={{
                                scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                                rotate: isHovered ? 5 : 0,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                            }}
                        >
                            <Icon className={`w-6 h-6 ${accent}`} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-bold text-gray-900 text-xl truncate ${accent}`}>
                                    {isThai ? titleThai : title}
                                </h3>
                                {hasTaken && (
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {isThai ? "เสร็จสิ้น" : "Completed"}
                                    </span>
                                )}
                            </div>
                            {!isSelected && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {isThai ? descriptionThai : description}
                                </p>
                            )}

                            {isSelected && (
                                <motion.div
                                    className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-gray-500" />
                                        {isThai ? `${quizzesCount} คำถาม` : `${quizzesCount} questions`}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <motion.div
                            animate={{
                                x: isHovered ? [0, 5, 0] : 0,
                                color: isSelected ? "#3b82f6" : "#9ca3af",
                            }}
                            transition={{ repeat: isHovered ? Infinity : 0, duration: 1.5 }}
                        >
                            <ChevronRight
                                className={`w-6 h-6 transition-transform duration-300 ${isSelected ? "rotate-90" : ""
                                    }`}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {hasTaken ? (
                            <motion.div
                                className="flex-1 px-5 py-3 border-2 border-green-500 rounded-xl bg-green-50 text-green-800 text-base font-semibold flex items-center justify-center gap-2"
                            >
                                <Award className="w-5 h-5" />
                                {isThai
                                    ? `คะแนนของคุณ: ${score}/${quizzesCount}`
                                    : `Your Score: ${score}/${quizzesCount}`
                                }
                            </motion.div>
                        ) : (
                            <>
                                <motion.button
                                    className="flex-1 px-5 py-3 border-2 border-blue-500 rounded-xl bg-blue-500 text-white text-base font-semibold hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push(`/dashboard/user/learn/${id}/quiz`)}
                                >
                                    <Award className="w-5 h-5" />
                                    {isThai ? "เริ่มแบบทดสอบ" : "Start Quiz"}
                                </motion.button>

                                <motion.button
                                    className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 text-base font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push(`/readguide/${id}`)}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    {isThai ? "เรียนรู้ก่อน" : "Learn First"}
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [isThai, setIsThai] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(true);

    const [userScores, setUserScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch('/api/user/score');
                const data = await res.json();
                setUserScores(data.scores);
            } catch (err) {
                console.error("Failed to fetch user scores:", err);
            }
        };

        fetchScores();
    }, []);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`/api/admin/topics?page=1&limit=100`);
                const data = await res.json();
                console.log("Fetched topics:", data);

                setTopics(data.topics || []);
            } catch (error) {
                console.error("Failed to fetch topics:", error);
            } finally {
                setLoadingTopics(false);
            }
        };

        fetchTopics();
    }, []);



    const handleCourseSelect = (courseId: string) => {
        setSelectedCourse(selectedCourse === courseId ? null : courseId);
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/unauthorized");
        }

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
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null; // Prevent render while redirecting
    }



    return (
        <div className="min-h-screen relative overflow-hidden bg-white text-gray-900">
            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <motion.nav
                    className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-md" : "bg-white py-5"
                        }`}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-1 flex items-center justify-center w-12 h-12">
                                <Image
                                    src="/Logo.svg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <motion.span
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                                whileHover={{ scale: 1.05 }}
                            >
                                Jitcyber
                            </motion.span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard/user"
                                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                <span>{isThai ? "แดชบอร์ด" : "Dashboard"}</span>
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
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-left"
                                                onClick={() => signOut({ callbackUrl: "/" })}
                                            >
                                                <LogOut className="w-4 h-4 text-gray-500" />
                                                {isThai ? "ออกจากระบบ" : "Logout"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setIsThai(!isThai)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium">{isThai ? "EN" : "ไทย"}</span>
                            </button>
                        </div>

                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={() => setIsThai(!isThai)}
                                className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium">{isThai ? "EN" : "ไทย"}</span>
                            </button>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </motion.nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden fixed inset-0 z-40 bg-white pt-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex flex-col items-center py-8 space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gray-200 rounded-xl w-16 h-16 flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-gray-900">{session?.user?.fullname || "User"}</p>
                                        {/* <p className="text-gray-500">{session?.user?.email || "user@example.com"}</p> */}
                                    </div>
                                </div>

                                <Link
                                    href="/dashboard/user"
                                    className="text-xl flex items-center gap-3 py-3 px-8 rounded-xl bg-gray-100 w-64 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Home className="w-6 h-6 text-gray-600" />
                                    <span className="text-gray-900">{isThai ? "แดชบอร์ด" : "Dashboard"}</span>
                                </Link>

                                <Link
                                    href="/profile"
                                    className="text-xl flex items-center gap-3 py-3 px-8 rounded-xl bg-gray-100 w-64 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-6 h-6 text-gray-600" />
                                    <span className="text-gray-900">{isThai ? "โปรไฟล์" : "Profile"}</span>
                                </Link>

                                <button
                                    className="text-xl flex items-center justify-center gap-3 py-3 px-8 rounded-xl bg-red-100 text-red-600 w-64"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    {isThai ? "ออกจากระบบ" : "Logout"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Section */}
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <motion.div
                                    className="inline-block px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-base font-medium mb-6"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        >
                                            <Sparkles className="w-5 h-5 text-blue-500" />
                                        </motion.div>
                                        {isThai ? "ทดสอบความรู้ของคุณ" : "Test Your Knowledge"}
                                    </div>
                                </motion.div>

                                <motion.h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {isThai ? "แบบทดสอบ" : "Learn"}{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                                        {isThai ? "ความปลอดภัยไซเบอร์" : "Cybersecurity"}
                                    </span>
                                </motion.h1>

                                <motion.p
                                    className="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {isThai
                                        ? "ท้าทายตัวเองด้วยแบบทดสอบแบบโต้ตอบและเรียนรู้แนวคิดด้านความปลอดภัยที่สำคัญ"
                                        : "Challenge yourself with interactive quizzes and master essential security concepts."}
                                </motion.p>
                            </motion.div>

                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="relative w-full max-w-lg">
                                    <div className="relative">
                                        <Image
                                            src="/chibi.svg"
                                            alt="Cybersecurity Illustration"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Course Modules Section */}
                <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                                {isThai ? "โมดูลการเรียนรู้" : "Learning Topics"}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                {isThai
                                    ? "เลือกหัวข้อด้านล่างเพื่อเริ่มการเรียนรู้"
                                    : "Select a topic below to begin your learning journey"}
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {loadingTopics ? (
                                <p className="text-center text-gray-500">{isThai ? "กำลังโหลด..." : "Loading topics..."}</p>
                            ) : (
                                topics.map((topic, index) => {
                                    const userScore = userScores.find(s => s.topicId === topic._id);
                                    console.log(userScore);
                                    const hasTaken = !!userScore;

                                    return (
                                        <CourseCard
                                            hasTaken={hasTaken}
                                            score={userScore?.score}
                                            key={topic._id}
                                            id={topic._id}
                                            title={topic.title}
                                            titleThai={topic.titleThai}
                                            description={topic.description}
                                            descriptionThai={topic.descriptionThai}
                                            icon={[Shield, Key, Eye, Smartphone][index % 4]}
                                            isSelected={selectedCourse === topic._id}
                                            onSelect={handleCourseSelect}
                                            color={["bg-blue-100", "bg-green-100", "bg-purple-100", "bg-amber-100"][index % 4]}
                                            accent={["text-blue-600", "text-green-600", "text-purple-600", "text-amber-600"][index % 4]}
                                            isThai={isThai}
                                            quizzesCount={topic.quizzesCount}
                                        />
                                    );
                                })
                            )}


                        </motion.div>
                    </div>
                </div>


                {/* Footer */}
                <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Image
                                        src="/Logo.svg"
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        Jitcyber
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    {isThai
                                        ? "ทำให้การเรียนรู้ด้านความปลอดภัยไซเบอร์เข้าถึงได้สำหรับทุกคน"
                                        : "Making cybersecurity learning accessible for everyone"}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold mb-4 text-gray-900">{isThai ? "ลิงก์ด่วน" : "Quick Links"}</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/dashboard/user" className="text-gray-600 hover:text-blue-600 transition-colors">{isThai ? "แดชบอร์ด" : "Dashboard"}</Link></li>
                                    <li><Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">{isThai ? "คอร์สเรียน" : "Courses"}</Link></li>
                                    <li><Link href="/resources" className="text-gray-600 hover:text-blue-600 transition-colors">{isThai ? "แหล่งข้อมูล" : "Resources"}</Link></li>
                                    <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">{isThai ? "เกี่ยวกับเรา" : "About Us"}</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold mb-4 text-gray-900">{isThai ? "ติดต่อเรา" : "Contact Us"}</h4>
                                <ul className="space-y-2">
                                    <li className="text-gray-600">Email: contact@jitcyber.com</li>
                                    <li className="text-gray-600">Twitter: @jitcyber</li>
                                    <li className="text-gray-600">Line: @jitcyber</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold mb-4 text-gray-900">{isThai ? "รับข่าวสาร" : "Newsletter"}</h4>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder={isThai ? "อีเมลของคุณ" : "Your email"}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                    />
                                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                                        {isThai ? "ส่ง" : "Send"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                            <p>© {new Date().getFullYear()} Jitcyber. {isThai ? "สงวนลิขสิทธิ์" : "All rights reserved"}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}