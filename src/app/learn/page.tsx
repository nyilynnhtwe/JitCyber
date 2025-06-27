"use client";
import React, { useState } from "react";
import {
    Shield,
    Eye,
    Key,
    Smartphone,
    ChevronRight,
    Award,
    Clock,
    BarChart2,
    Sparkles,
    BookOpen,
    Home,
    Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseCardProps {
    id: string;
    title: string;
    titleThai: string;
    description: string;
    descriptionThai: string;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: (id: string) => void;
    color: string;
    isThai: boolean;
}

const courseData = [
    {
        id: "phishing",
        title: "Phishing Prevention",
        titleThai: "การป้องกันฟิชชิ่ง",
        description: "Learn to identify and avoid phishing attempts.",
        descriptionThai: "เรียนรู้วิธีระบุและหลีกเลี่ยงการโจมตีแบบฟิชชิ่ง",
        icon: Shield,
        stats: { questions: 12, duration: "8 min", difficulty: "Medium" },
        statsThai: { questions: 12, duration: "8 นาที", difficulty: "ปานกลาง" },
        color: "from-blue-600 to-blue-800",
        videoUrl: "https://youtu.be/Y7zNlEMDmI4",
    },
    {
        id: "password",
        title: "Password Security",
        titleThai: "ความปลอดภัยของรหัสผ่าน",
        description: "Create strong, secure passwords to protect your accounts.",
        descriptionThai: "สร้างรหัสผ่านที่แข็งแกร่งเพื่อปกป้องบัญชีของคุณ",
        icon: Key,
        stats: { questions: 10, duration: "6 min", difficulty: "Easy" },
        statsThai: { questions: 10, duration: "6 นาที", difficulty: "ง่าย" },
        color: "from-teal-600 to-blue-700",
        videoUrl: "https://youtu.be/BoyeFozmAXk",
    },
    {
        id: "social",
        title: "Social Engineering",
        titleThai: "วิศวกรรมสังคม",
        description: "Understand and defend against social engineering tactics.",
        descriptionThai: "เข้าใจและป้องกันกลวิธีทางวิศวกรรมสังคม",
        icon: Eye,
        stats: { questions: 15, duration: "10 min", difficulty: "Hard" },
        statsThai: { questions: 15, duration: "10 นาที", difficulty: "ยาก" },
        color: "from-indigo-600 to-blue-800",
        videoUrl: "https://youtu.be/uvKTMgWRPw4",
    },
    {
        id: "mobile",
        title: "Mobile Security",
        titleThai: "ความปลอดภัยบนมือถือ",
        description: "Secure your mobile devices from threats and malware.",
        descriptionThai: "ปกป้องอุปกรณ์มือถือจากภัยคุกคามและมัลแวร์",
        icon: Smartphone,
        stats: { questions: 8, duration: "5 min", difficulty: "Easy" },
        statsThai: { questions: 8, duration: "5 นาที", difficulty: "ง่าย" },
        color: "from-cyan-600 to-blue-700",
        videoUrl: "https://youtu.be/AXHTVTDj-R8",
    },
];

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
    isThai,
}: CourseCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    return (
        <div className="space-y-3 w-full">
            <motion.div
                className={`relative overflow-hidden bg-white border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected ? "ring-2 ring-blue-700 shadow-lg" : "hover:border-blue-300"
                }`}
                onClick={() => onSelect(id)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Animated gradient background */}
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        background: [
                            `linear-gradient(45deg, ${color.split("from-")[1].split(" ")[0]}, ${
                                color.split("to-")[1]
                            })`,
                            `linear-gradient(135deg, ${color.split("from-")[1].split(" ")[0]}, ${
                                color.split("to-")[1]
                            })`,
                            `linear-gradient(225deg, ${color.split("from-")[1].split(" ")[0]}, ${
                                color.split("to-")[1]
                            })`,
                            `linear-gradient(315deg, ${color.split("from-")[1].split(" ")[0]}, ${
                                color.split("to-")[1]
                            })`,
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Content Container */}
                <div className="relative z-10 p-5 backdrop-blur-sm bg-white/80">
                    <div className="flex items-start gap-4">
                        <motion.div
                            className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-md flex-shrink-0`}
                            animate={{
                                scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                                rotate: isHovered ? 5 : 0,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                            }}
                        >
                            <Icon className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg mb-1.5 truncate">
                                {isThai ? titleThai : title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {isThai ? descriptionThai : description}
                            </p>

                            {isSelected && (
                                <motion.div
                                    className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="flex items-center gap-1">
                                        <BarChart2 className="w-3 h-3" />
                                        {isThai
                                            ? `${courseData.find(c => c.id === id)?.statsThai.questions} คำถาม`
                                            : `${courseData.find(c => c.id === id)?.stats.questions} questions`}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {isThai 
                                            ? courseData.find(c => c.id === id)?.statsThai.duration 
                                            : courseData.find(c => c.id === id)?.stats.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Award className="w-3 h-3" />
                                        {isThai
                                            ? courseData.find(c => c.id === id)?.statsThai.difficulty
                                            : courseData.find(c => c.id === id)?.stats.difficulty}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <motion.div
                            animate={{
                                x: isHovered ? [0, 5, 0] : 0,
                                color: isSelected ? "#1d4ed8" : "#9ca3af",
                            }}
                            transition={{ repeat: isHovered ? Infinity : 0, duration: 1.5 }}
                        >
                            <ChevronRight
                                className={`w-5 h-5 transition-transform duration-300 ${
                                    isSelected ? "rotate-90" : ""
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
                        <motion.button
                            className="flex-1 px-4 py-3 border-2 border-blue-700 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-white text-sm font-semibold hover:from-blue-800 hover:to-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/quiz/${id}`)}
                        >
                            <Award className="w-4 h-4" />
                            {isThai ? "เริ่มแบบทดสอบ" : "Start Quiz"}
                        </motion.button>

                        <motion.button
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/readguide/${id}`)}
                        >
                            <BookOpen className="w-4 h-4" />
                            {isThai ? "เรียนรู้ก่อน" : "Learn First"}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Page() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [isThai, setIsThai] = useState(false);

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourse(selectedCourse === courseId ? null : courseId);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 bg-[radial-gradient(circle,_rgba(0,0,0,0.2)_1.5px,_transparent_1px)] bg-[length:80px_80px] bg-repeat text-gray-900">
            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-1 flex items-center justify-center w-12 h-12">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <motion.span
                            className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                        >
                            Jitcyber
                        </motion.span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-700 transition-colors"
                        >
                            <Home className="w-5 h-5 text-blue-500" />
                            <span className="hidden sm:inline">{isThai ? "หน้าหลัก" : "Home"}</span>
                        </Link>

                        <button
                            onClick={() => setIsThai(!isThai)}
                            className="flex items-center gap-1 px-3 py-2 rounded-full bg-blue-100 hover:bg-gray-200 transition-colors"
                        >
                            <Globe className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium">{isThai ? "EN" : "ไทย"}</span>
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="flex justify-center mb-6">
                        <Image 
                            src="/chibi.svg"
                            alt="Cybersecurity Illustration"
                            width={280}
                            height={280}
                            className="w-70 h-70"
                        />
                    </div>
                    <motion.div
                        className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4 shadow-inner"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            >
                                <Sparkles className="w-4 h-4 text-green-600" />
                            </motion.div>
                            {isThai ? "ทดสอบความรู้ของคุณ" : "Test Your Knowledge"}
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-7 leading-tight"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {isThai ? "แบบทดสอบ" : "Learn"}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
                            {isThai ? "ความปลอดภัยไซเบอร์" : "Cybersecurity"}
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed mb-0"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {isThai
                            ? "ท้าทายตัวเองด้วยแบบทดสอบแบบโต้ตอบและเรียนรู้แนวคิดด้านความปลอดภัยที่สำคัญ"
                            : "Challenge yourself with interactive quizzes and master essential security concepts."}
                    </motion.p>
                </div>

                {/* Course Modules Section */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {courseData.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                titleThai={course.titleThai}
                                description={course.description}
                                descriptionThai={course.descriptionThai}
                                icon={course.icon}
                                isSelected={selectedCourse === course.id}
                                onSelect={handleCourseSelect}
                                color={course.color}
                                isThai={isThai}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}