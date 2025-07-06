"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocalContext';
import Footer from '@/app/components/Footer';
import PasswordStrengthMeter from '@/app/components/PasswordStrengthMeter';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Shield, RefreshCw, ArrowLeft, Check, X, User, Menu, X as CloseIcon, LogOut, Home, HelpCircle, ChevronRight } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import Link from 'next/link';
import Image from 'next/image';

// Import localization data
import enData from '@/app/data/en.json';
import thData from '@/app/data/th.json';

export default function PasswordChecker() {
  const { locale } = useLocale();
  const t = locale === 'th' ? thData : enData;
  const router = useRouter();
  const { data: session, status } = useSession();

  // Header state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Password state
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Password strength calculation
  const checkPasswordStrength = (pwd: string) => {
    let strengthValue = 0;

    // Length check
    if (pwd.length >= 8) strengthValue += 20;
    if (pwd.length >= 12) strengthValue += 20;

    // Character diversity
    if (/[A-Z]/.test(pwd)) strengthValue += 15;
    if (/[a-z]/.test(pwd)) strengthValue += 15;
    if (/[0-9]/.test(pwd)) strengthValue += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) strengthValue += 15;

    // Deduct for common patterns
    if (/(.)\1{2,}/.test(pwd)) strengthValue -= 10; // Repeated characters
    if (/(123|abc|password|qwerty)/i.test(pwd)) strengthValue -= 20; // Common patterns

    return Math.max(0, Math.min(100, strengthValue));
  };

  // Update strength when password changes
  useEffect(() => {
    setStrength(checkPasswordStrength(password));
  }, [password]);

  // Strength labels
  const getStrengthLabel = () => {
    if (strength === 0) return locale === 'th' ? 'ยังไม่ตรวจสอบ' : 'Not checked';
    if (strength < 40) return locale === 'th' ? 'อ่อนแอ' : 'Weak';
    if (strength < 70) return locale === 'th' ? 'ปานกลาง' : 'Medium';
    if (strength < 90) return locale === 'th' ? 'แข็งแกร่ง' : 'Strong';
    return locale === 'th' ? 'แข็งแกร่งมาก' : 'Very Strong';
  };

  // Strength color
  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-green-500';
    return 'bg-blue-500';
  };

  // Password tips
  const passwordTips = [
    { 
      icon: <Lock className="w-5 h-5" />,
      text: locale === 'th' ? 'ใช้อย่างน้อย 12 ตัวอักษร' : 'Use at least 12 characters' 
    },
    { 
      icon: <div className="text-lg">Aa</div>,
      text: locale === 'th' ? 'ผสมตัวอักษรใหญ่และเล็ก' : 'Mix uppercase and lowercase letters' 
    },
    { 
      icon: <div className="text-lg">123</div>,
      text: locale === 'th' ? 'เพิ่มตัวเลข (เช่น 1, 2, 3)' : 'Include numbers (e.g., 1, 2, 3)' 
    },
    { 
      icon: <div className="text-lg">!@#</div>,
      text: locale === 'th' ? 'ใช้สัญลักษณ์ (!, @, #, $)' : 'Use symbols (!, @, #, $)' 
    },
    { 
      icon: <User className="w-5 h-5" />,
      text: locale === 'th' ? 'หลีกเลี่ยงข้อมูลส่วนตัว (ชื่อ, วันเกิด)' : 'Avoid personal info (name, birthday)' 
    },
    { 
      icon: <RefreshCw className="w-5 h-5" />,
      text: locale === 'th' ? 'อย่าใช้รหัสผ่านซ้ำกัน' : "Don't reuse passwords" 
    },
    { 
      icon: <Shield className="w-5 h-5" />,
      text: locale === 'th' ? 'ใช้ตัวจัดการรหัสผ่าน' : 'Use a password manager' 
    },
    { 
      icon: <div className="text-lg">3-6</div>,
      text: locale === 'th' ? 'เปลี่ยนรหัสผ่านทุก 3-6 เดือน' : 'Change passwords every 3-6 months' 
    }
  ];

  // Generate strong password
  const generatePassword = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      
      // Ensure at least one character from each category
      password += chars[Math.floor(Math.random() * 26)]; // Uppercase
      password += chars[26 + Math.floor(Math.random() * 26)]; // Lowercase
      password += chars[52 + Math.floor(Math.random() * 10)]; // Number
      password += chars[62 + Math.floor(Math.random() * 30)]; // Symbol
      
      // Generate remaining characters
      for (let i = 4; i < 14; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }
      
      // Shuffle password
      password = password.split('').sort(() => 0.5 - Math.random()).join('');
      setPassword(password);
      setIsGenerating(false);
    }, 800);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert(locale === 'th' ? 'คัดลอกรหัสผ่านแล้ว!' : 'Password copied!');
  };

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
        <title>{t.appName} - {locale === 'th' ? 'ตรวจสอบความแข็งแกร่งรหัสผ่าน' : 'Password Strength Checker'}</title>
        <meta name="description" content={locale === 'th' ? 'ตรวจสอบความปลอดภัยของรหัสผ่านของคุณ' : 'Check the security of your passwords'} />
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
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full p-3 mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                    {locale === 'th' ? 'ตรวจสอบความแข็งแกร่งรหัสผ่าน' : 'Password Strength Checker'}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {locale === 'th'
                      ? 'ตรวจสอบว่ารหัสผ่านของคุณปลอดภัยเพียงพอที่จะป้องกันแฮกเกอร์'
                      : 'Check if your password is secure enough to protect against hackers'}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100"
              >
                <div className="mb-8">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-3">
                    {locale === 'th' ? 'ป้อนรหัสผ่านของคุณ:' : 'Enter your password:'}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-mono"
                      placeholder={locale === 'th' ? 'ป้อนรหัสผ่านที่นี่...' : 'Enter your password here...'}
                    />
                    <button
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1"
                      aria-label={isVisible ? (locale === 'th' ? 'ซ่อนรหัสผ่าน' : 'Hide password') : (locale === 'th' ? 'แสดงรหัสผ่าน' : 'Show password')}
                    >
                      {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={generatePassword}
                      disabled={isGenerating}
                      className={`flex items-center px-4 py-2 rounded-lg transition ${
                        isGenerating 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      {locale === 'th' ? 'สร้างรหัสผ่านใหม่' : 'Generate Password'}
                    </button>
                    
                    {password && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {locale === 'th' ? 'คัดลอก' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">
                      {locale === 'th' ? 'ความแข็งแกร่ง:' : 'Strength:'}
                    </span>
                    <span className={`font-bold ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <PasswordStrengthMeter strength={strength} color={getStrengthColor()} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {locale === 'th' ? 'การวิเคราะห์รหัสผ่าน' : 'Password Analysis'}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        {password.length >= 8 ? (
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
                              ? `ความยาว: ${password.length} ตัวอักษร`
                              : `Length: ${password.length} characters`}
                          </span>
                          <p className="text-sm text-gray-500">
                            {locale === 'th'
                              ? '(แนะนำอย่างน้อย 8 ตัว)'
                              : '(recommend at least 8)'}
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        {/[A-Z]/.test(password) ? (
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
                            ? 'มีตัวอักษรตัวใหญ่'
                            : 'Contains uppercase letters'}
                        </span>
                      </li>
                      
                      <li className="flex items-start">
                        {/[0-9]/.test(password) ? (
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
                            ? 'มีตัวเลข'
                            : 'Contains numbers'}
                        </span>
                      </li>
                      
                      <li className="flex items-start">
                        {/[^A-Za-z0-9]/.test(password) ? (
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
                            ? 'มีสัญลักษณ์พิเศษ'
                            : 'Contains special characters'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-indigo-800 flex items-center">
                        <Lock className="w-5 h-5 mr-2" />
                        {locale === 'th' ? 'เคล็ดลับรหัสผ่านที่ปลอดภัย' : 'Secure Password Tips'}
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
                              {passwordTips.map((tip, index) => (
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
                        {locale === 'th' ? 'ตัวอย่างรหัสผ่านที่แข็งแกร่ง:' : 'Examples of strong passwords:'}
                      </h4>
                      <div className="text-sm bg-gray-100 rounded-xl p-4 font-mono">
                        <p className="mb-2">Blue!Sky@Mountain#2023</p>
                        <p>ThaiFood$PadThai*4Me</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-indigo-800 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {locale === 'th' ? 'คำแนะนำเพิ่มเติม' : 'Additional Recommendations'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3 text-lg">
                          🔑
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-800 mb-2">
                            {locale === 'th' ? 'ตัวจัดการรหัสผ่าน' : 'Password Managers'}
                          </h4>
                          <p className="text-gray-700">
                            {locale === 'th'
                              ? 'ใช้แอปจัดการรหัสผ่านเพื่อสร้างและเก็บรหัสผ่านที่ซับซ้อนโดยไม่ต้องจำ'
                              : 'Use password managers to generate and store complex passwords without memorizing them'}
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
                          🔒
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 mb-2">
                            {locale === 'th' ? 'การยืนยันตัวตนสองขั้นตอน' : 'Two-Factor Authentication'}
                          </h4>
                          <p className="text-gray-700">
                            {locale === 'th'
                              ? 'เปิดใช้งาน 2FA เพื่อเพิ่มความปลอดภัยให้กับบัญชีของคุณ'
                              : 'Enable 2FA to add an extra layer of security to your accounts'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-12"
              >
                <button
                  onClick={() => router.push('/dashboard/user')}
                  className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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