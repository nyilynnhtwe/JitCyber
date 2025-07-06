"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocalContext';
import Footer from '@/app/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Shield, RefreshCw, ArrowLeft,
  Check, X, User, Menu, X as CloseIcon, LogOut, Home, HelpCircle, Mail, ChevronRight,
  BookOpen
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import Link from 'next/link';
import Image from 'next/image';

// Import localization data
import enData from '@/app/data/en.json';
import thData from '@/app/data/th.json';

// Moved outside component to prevent recreation on every render
const disposableDomains = [
  'mailinator.com', 'tempmail.com', 'guerrillamail.com',
  '10minutemail.com', 'fakeinbox.com', 'throwawaymail.com',
  'trashmail.com', 'maildrop.cc', 'dispostable.com',
  'yopmail.com', 'getnada.com', 'temp-mail.org'
];

interface AnalysisState {
  isValidFormat: boolean;
  isDisposable: boolean;
  isSuspicious: boolean;
  domain: string;
  score: number;
  status: string;
  statusColor: string;
  reasons: string[];
}

interface ContentAnalysisState {
  raw: string;
}

export default function EmailChecker() {
  const { locale } = useLocale();
  const t = locale === 'th' ? thData : enData;
  const router = useRouter();
  const { data: session, status } = useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Header state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Email state
  const [email, setEmail] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysisState | null>(null);

  // Header functions
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

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

  // Check email authenticity
  const checkEmail = useCallback((email: string) => {
    setIsLoading(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const emailParts = email.split('@');
      const domain = emailParts.length > 1 ? emailParts[1] : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);
      const isDisposable: boolean = domain ? disposableDomains.includes(domain.toLowerCase()) : false;
      const hasRandomChars = /[0-9]{6,}@/.test(email) || /[a-z]{10,}@/.test(email);
      const isSuspicious = hasRandomChars || email.includes('+fake') || email.includes('.fake');

      let score = 100;
      const reasons: string[] = [];

      if (!isValidFormat) {
        score -= 40;
        reasons.push(locale === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Invalid email format');
      }

      if (isDisposable) {
        score -= 30;
        reasons.push(locale === 'th' ? 'โดเมนอีเมลแบบชั่วคราว' : 'Disposable email domain');
      }

      if (isSuspicious) {
        score -= 25;
        reasons.push(locale === 'th' ? 'รูปแบบน่าสงสัย' : 'Suspicious pattern');
      }

      score = Math.max(0, score);

      let status = '';
      let statusColor = '';

      if (score > 80) {
        status = locale === 'th' ? 'น่าเชื่อถือ' : 'Trustworthy';
        statusColor = 'bg-green-500';
      } else if (score > 50) {
        status = locale === 'th' ? 'ปานกลาง' : 'Medium';
        statusColor = 'bg-yellow-500';
      } else {
        status = locale === 'th' ? 'น่าสงสัย' : 'Suspicious';
        statusColor = 'bg-red-500';
      }

      setAnalysis({
        isValidFormat,
        isDisposable,
        isSuspicious,
        domain,
        score,
        status,
        statusColor,
        reasons
      });

      setIsLoading(false);
    }, 800);
  }, [locale]);

  useEffect(() => {
    if (email.includes('@') && email.length > 5) {
      checkEmail(email);
    } else {
      setAnalysis(null);
      setIsLoading(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [email, checkEmail]);

  // Email content analysis with locale
  const analyzeEmailContent = async () => {
    if (!emailContent.trim()) return;

    setIsLoading(true);
    setContentAnalysis(null);

    try {
      const response = await fetch('/api/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: emailContent,
          locale: locale  // Send current locale to API
        }),
      });

      const result = await response.json();

      if (result.data) {
        setContentAnalysis({ raw: result.data });
      } else {
        setContentAnalysis({
          raw: locale === 'th' ? 'ไม่สามารถวิเคราะห์อีเมลนี้ได้' : 'Unable to analyze this email'
        });
      }
    } catch (error) {
      console.error('Email content analysis failed:', error);
      setContentAnalysis({
        raw: locale === 'th' ? 'เกิดข้อผิดพลาดในการวิเคราะห์' : 'Error analyzing the email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Email security tips
  const emailTips = [
    {
      icon: <Mail className="w-5 h-5" />,
      text: locale === 'th' ? 'ตรวจสอบชื่อโดเมนหลังเครื่องหมาย @' : 'Check the domain name after the @ symbol'
    },
    {
      icon: <div className="text-lg">123</div>,
      text: locale === 'th' ? 'ระวังอีเมลที่มีตัวเลขหรือตัวอักษรสุ่มจำนวนมาก' : 'Beware of emails with lots of random numbers/letters'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: locale === 'th' ? 'ใช้บริการตรวจสอบอีเมลออนไลน์ก่อนตอบกลับ' : 'Use online verification services before replying'
    },
    {
      icon: <Lock className="w-5 h-5" />,
      text: locale === 'th' ? 'อย่าคลิกลิงก์หรือเปิดไฟล์แนบจากอีเมลที่ไม่รู้จัก' : "Don't click links or open attachments from unknown emails"
    },
    {
      icon: <User className="w-5 h-5" />,
      text: locale === 'th' ? 'ตรวจสอบที่อยู่อีเมลผู้ส่งอย่างละเอียด' : 'Carefully examine the sender email address'
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      text: locale === 'th' ? 'ใช้ที่อยู่อีเมลเฉพาะสำหรับการสมัครบริการออนไลน์' : 'Use dedicated email addresses for online registrations'
    },
    {
      icon: <div className="text-lg">2FA</div>,
      text: locale === 'th' ? 'เปิดใช้การยืนยันตัวตนสองขั้นตอนสำหรับบัญชีอีเมล' : 'Enable two-factor authentication for email accounts'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: locale === 'th' ? 'เรียนรู้เกี่ยวกับเทคนิคการฟิชชิ่ง' : 'Educate yourself about phishing techniques'
    }
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
        <title>{t.appName} - {locale === 'th' ? 'ตรวจสอบอีเมลปลอม' : 'Fake Email Detector'}</title>
        <meta name="description" content={locale === 'th' ? 'ตรวจสอบความน่าเชื่อถือของที่อยู่อีเมล' : 'Check the authenticity of email addresses'} />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
        {/* Header */}
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
                {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </motion.header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed top-16 right-0 bg-white w-64 h-full z-40 shadow-xl animate-slide-in-right"
          >
            <div className="flex flex-col py-4">
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div>
                    <p className="font-medium text-slate-800">{session?.user?.fullname || 'User'}</p>
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

        {/* Main Content */}
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                  {locale === 'th' ? 'เครื่องมือตรวจสอบอีเมลปลอม' : 'Fake Email Detector'}
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  {locale === 'th'
                    ? 'ตรวจสอบว่าอีเมลนั้นเป็นของแท้หรือถูกสร้างขึ้นมาเพื่อหลอกลวง'
                    : 'Verify whether an email is genuine or created for deceptive purposes'}
                </p>
              </motion.div>

              {/* Email Checker Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100"
              >
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-3">
                    {locale === 'th' ? 'ป้อนที่อยู่อีเมล:' : 'Enter email address:'}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="example@domain.com"
                    />
                    <button
                      onClick={() => checkEmail(email)}
                      disabled={!email.includes('@') || email.length < 5}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${!email.includes('@') || email.length < 5
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                      aria-label={locale === 'th' ? 'ตรวจสอบอีเมล' : 'Check email'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isLoading && (
                  <div className="flex justify-center mb-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                  </div>
                )}

                {analysis && !isLoading && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-medium">
                        {locale === 'th' ? 'สถานะ:' : 'Status:'}
                      </span>
                      <span className={`font-bold ${analysis.statusColor.replace('bg-', 'text-')}`}>
                        {analysis.status}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                      <div
                        className={`h-2.5 rounded-full ${analysis.statusColor}`}
                        style={{ width: `${analysis.score}%` }}
                        role="progressbar"
                        aria-valuenow={analysis.score}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                          <Shield className="w-5 h-5 mr-2" />
                          {locale === 'th' ? 'ผลการวิเคราะห์' : 'Analysis Results'}
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            {analysis.isValidFormat ? (
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-2">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium">
                                {locale === 'th'
                                  ? `รูปแบบอีเมล: ${analysis.isValidFormat ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}`
                                  : `Email format: ${analysis.isValidFormat ? 'Valid' : 'Invalid'}`}
                              </span>
                            </div>
                          </li>

                          <li className="flex items-start">
                            {!analysis.isDisposable ? (
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-2">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <span className="font-medium">
                                {locale === 'th'
                                  ? `โดเมน: ${analysis.domain}`
                                  : `Domain: ${analysis.domain}`}
                              </span>
                              <p className="text-sm text-gray-500">
                                {analysis.isDisposable
                                  ? (locale === 'th' ? '(โดเมนชั่วคราว)' : '(Disposable domain)')
                                  : (locale === 'th' ? '(โดเมนถาวร)' : '(Permanent domain)')}
                              </p>
                            </div>
                          </li>

                          <li className="flex items-start">
                            {!analysis.isSuspicious ? (
                              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-2">
                                <X className="w-4 h-4" />
                              </div>
                            )}
                            <span className="font-medium">
                              {locale === 'th'
                                ? `รูปแบบ: ${analysis.isSuspicious ? 'น่าสงสัย' : 'ปกติ'}`
                                : `Pattern: ${analysis.isSuspicious ? 'Suspicious' : 'Normal'}`}
                            </span>
                          </li>

                          {analysis.reasons.length > 0 && (
                            <li className="mt-4 p-3 bg-red-50 rounded-xl">
                              <h4 className="font-medium text-red-800 mb-1">
                                {locale === 'th' ? 'เหตุผลที่น่าสงสัย:' : 'Reasons for suspicion:'}
                              </h4>
                              <ul className="list-disc pl-5 text-red-700">
                                {analysis.reasons.map((reason, index) => (
                                  <li key={index}>{reason}</li>
                                ))}
                              </ul>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-indigo-800 flex items-center">
                            <Lock className="w-5 h-5 mr-2" />
                            {locale === 'th' ? 'เคล็ดลับการตรวจสอบอีเมล' : 'Email Verification Tips'}
                          </h3>
                          <button
                            onClick={() => setShowTips(!showTips)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <span className="mr-1">
                              {showTips
                                ? (locale === 'th' ? 'ซ่อน' : 'Hide')
                                : (locale === 'th' ? 'แสดง' : 'Show')}
                            </span>
                            <svg
                              className={`w-4 h-4 transform transition-transform ${showTips ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <AnimatePresence>
                          {showTips && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-indigo-50 rounded-xl p-4">
                                <ul className="space-y-3">
                                  {emailTips.map((tip, index) => (
                                    <motion.li
                                      key={index}
                                      className="flex items-start"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mt-0.5 mr-3">
                                        {tip.icon}
                                      </div>
                                      <span className="pt-0.5">{tip.text}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-6">
                          <h4 className="font-bold text-gray-700 mb-3">
                            {locale === 'th' ? 'ตัวอย่างอีเมลปลอม:' : 'Examples of fake emails:'}
                          </h4>
                          <div className="text-sm bg-gray-100 rounded-xl p-4 font-mono">
                            <p className="mb-2">john12345@tempmail.com</p>
                            <p>support@paypa1-security.com</p>
                            <p className="mt-2">amazon-customer@service-fake.net</p>
                            <p>info@faceboook-support.xyz</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {locale === 'th' ? 'การป้องกันการหลอกลวงทางอีเมล' : 'Email Fraud Prevention'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3 text-lg">
                              🛡️
                            </div>
                            <div>
                              <h4 className="font-bold text-blue-800 mb-2">
                                {locale === 'th' ? 'การรับรู้อีเมลฟิชชิ่ง' : 'Phishing Awareness'}
                              </h4>
                              <p className="text-gray-700">
                                {locale === 'th'
                                  ? 'เรียนรู้วิธีการระบุอีเมลฟิชชิ่งที่พยายามขโมยข้อมูลของคุณ'
                                  : 'Learn how to identify phishing emails attempting to steal your information'}
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -5 }}
                          className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3 text-lg">
                              🔍
                            </div>
                            <div>
                              <h4 className="font-bold text-green-800 mb-2">
                                {locale === 'th' ? 'การยืนยันโดเมน' : 'Domain Verification'}
                              </h4>
                              <p className="text-gray-700">
                                {locale === 'th'
                                  ? 'ตรวจสอบโดเมนอย่างระมัดระวังเพื่อให้แน่ใจว่าอีเมลมาจากแหล่งที่ถูกต้อง'
                                  : 'Carefully verify domains to ensure emails come from legitimate sources'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}

                {!analysis && !isLoading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                      <Mail className="h-8 w-8" />
                    </div>
                    <p className="text-gray-600">
                      {locale === 'th'
                        ? 'ป้อนที่อยู่อีเมลเพื่อเริ่มการตรวจสอบ'
                        : 'Enter an email address to begin verification'}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Email Content Analyzer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-indigo-800 mb-4">
                  {locale === 'th' ? 'วางเนื้อหาอีเมลเพื่อตรวจสอบ' : 'Paste Email Content to Analyze'}
                </h2>
                <textarea
                  rows={6}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
                  placeholder={locale === 'th' ? 'วางเนื้อหาอีเมลที่นี่...' : 'Paste the email content here...'}
                ></textarea>
                <button
                  onClick={analyzeEmailContent}
                  disabled={emailContent.length < 20}
                  className={`px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition ${emailContent.length < 20 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {locale === 'th' ? 'วิเคราะห์จดหมาย' : 'Analyze Letter'}
                </button>

                {contentAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-xl whitespace-pre-wrap text-gray-800">
                      <h4 className="font-semibold text-indigo-700 mb-2">
                        {locale === 'th' ? 'ผลการวิเคราะห์ด้วย AI:' : 'AI Analysis Result:'}
                      </h4>
                      <p>{contentAnalysis.raw}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <button
                  onClick={() => router.push('/dashboard/user')}
                  className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {locale === 'th' ? 'กลับไปยังแดชบอร์ด' : 'Back to Dashboard'}
                </button>
              </motion.div>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6">
          <Footer t={t} locale={locale} />
        </footer>
      </div>
    </>
  );
}