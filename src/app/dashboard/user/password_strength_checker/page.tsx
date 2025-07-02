"use client";
// src/pages/password-checker.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocalContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PasswordStrengthMeter from '@/app/components/PasswordStrengthMeter';

// Import localization data
import enData from '@/app/data/en.json';
import thData from '@/app/data/th.json';

export default function PasswordChecker() {
  const { locale } = useLocale();
  const t = locale === 'th' ? thData : enData;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Password strength criteria
  const checkPasswordStrength = (pwd) => {
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
    locale === 'th' ? 'ใช้อย่างน้อย 12 ตัวอักษร' : 'Use at least 12 characters',
    locale === 'th' ? 'ผสมตัวอักษรใหญ่และเล็ก' : 'Mix uppercase and lowercase letters',
    locale === 'th' ? 'เพิ่มตัวเลข (เช่น 1, 2, 3)' : 'Include numbers (e.g., 1, 2, 3)',
    locale === 'th' ? 'ใช้สัญลักษณ์ (!, @, #, $)' : 'Use symbols (!, @, #, $)',
    locale === 'th' ? 'หลีกเลี่ยงข้อมูลส่วนตัว (ชื่อ, วันเกิด)' : 'Avoid personal info (name, birthday)',
    locale === 'th' ? 'อย่าใช้รหัสผ่านซ้ำกัน' : "Don't reuse passwords",
    locale === 'th' ? 'ใช้ตัวจัดการรหัสผ่าน' : 'Use a password manager',
    locale === 'th' ? 'เปลี่ยนรหัสผ่านทุก 3-6 เดือน' : 'Change passwords every 3-6 months'
  ];

  return (
    <>
      <Head>
        <title>{t.appName} - {locale === 'th' ? 'ตรวจสอบความแข็งแกร่งรหัสผ่าน' : 'Password Strength Checker'}</title>
        <meta name="description" content={locale === 'th' ? 'ตรวจสอบความปลอดภัยของรหัสผ่านของคุณ' : 'Check the security of your passwords'} />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
        <Header />

        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                  {locale === 'th' ? 'ตรวจสอบความแข็งแกร่งรหัสผ่าน' : 'Password Strength Checker'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {locale === 'th'
                    ? 'ตรวจสอบว่ารหัสผ่านของคุณปลอดภัยเพียงพอที่จะป้องกันแฮกเกอร์'
                    : 'Check if your password is secure enough to protect against hackers'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    {locale === 'th' ? 'ป้อนรหัสผ่านของคุณ:' : 'Enter your password:'}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder={locale === 'th' ? 'ป้อนรหัสผ่านที่นี่...' : 'Enter your password here...'}
                    />
                    <button
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                      aria-label={isVisible ? (locale === 'th' ? 'ซ่อนรหัสผ่าน' : 'Hide password') : (locale === 'th' ? 'แสดงรหัสผ่าน' : 'Show password')}
                    >
                      {isVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">
                      {locale === 'th' ? 'ความแข็งแกร่ง:' : 'Strength:'}
                    </span>
                    <span className={`font-bold ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <PasswordStrengthMeter strength={strength} color={getStrengthColor()} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                      {locale === 'th' ? 'การวิเคราะห์รหัสผ่าน' : 'Password Analysis'}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        {password.length >= 8 ? (
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>
                          {locale === 'th'
                            ? `ความยาว: ${password.length} ตัวอักษร (แนะนำอย่างน้อย 8 ตัว)`
                            : `Length: ${password.length} characters (recommend at least 8)`}
                        </span>
                      </li>
                      <li className="flex items-start">
                        {/[A-Z]/.test(password) ? (
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>
                          {locale === 'th'
                            ? 'มีตัวอักษรตัวใหญ่'
                            : 'Contains uppercase letters'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        {/[0-9]/.test(password) ? (
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>
                          {locale === 'th'
                            ? 'มีตัวเลข'
                            : 'Contains numbers'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        {/[^A-Za-z0-9]/.test(password) ? (
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>
                          {locale === 'th'
                            ? 'มีสัญลักษณ์พิเศษ'
                            : 'Contains special characters'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-indigo-800">
                        {locale === 'th' ? 'สร้างรหัสผ่านที่ปลอดภัย' : 'Create a Secure Password'}
                      </h3>
                      <button
                        onClick={() => setShowTips(!showTips)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <span className="mr-1">
                          {showTips
                            ? (locale === 'th' ? 'ซ่อน' : 'Hide')
                            : (locale === 'th' ? 'แสดงเคล็ดลับ' : 'Show Tips')}
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

                    {showTips && (
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {passwordTips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mt-0.5 mr-2">
                                {index + 1}
                              </div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {locale === 'th' ? 'ตัวอย่างรหัสผ่านที่แข็งแกร่ง:' : 'Examples of strong passwords:'}
                      </h4>
                      <div className="text-sm bg-gray-100 rounded-lg p-3">
                        <p className="mb-1">Blue!Sky@Mountain#2023</p>
                        <p>ThaiFood$PadThai*4Me</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-indigo-800 mb-4">
                    {locale === 'th' ? 'คำแนะนำเพิ่มเติม' : 'Additional Recommendations'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                          🔑
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">
                            {locale === 'th' ? 'ตัวจัดการรหัสผ่าน' : 'Password Managers'}
                          </h4>
                          <p className="text-sm">
                            {locale === 'th'
                              ? 'ใช้แอปจัดการรหัสผ่านเพื่อสร้างและเก็บรหัสผ่านที่ซับซ้อนโดยไม่ต้องจำ'
                              : 'Use password managers to generate and store complex passwords without memorizing them'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                          🔒
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">
                            {locale === 'th' ? 'การยืนยันตัวตนสองขั้นตอน' : 'Two-Factor Authentication'}
                          </h4>
                          <p className="text-sm">
                            {locale === 'th'
                              ? 'เปิดใช้งาน 2FA เพื่อเพิ่มความปลอดภัยให้กับบัญชีของคุณ'
                              : 'Enable 2FA to add an extra layer of security to your accounts'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => router.push('/dashboard/user')}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {locale === 'th' ? 'กลับไปยังหน้าหลัก' : 'Back to Dashboard'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer t={t} locale={locale} />
      </div>
    </>
  );
}

