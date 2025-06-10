"use client";
// src/pages/email-checker.js
import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocalContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import localization data
import enData from '../data/en.json';
import thData from '../data/th.json';

// Moved outside component to prevent recreation on every render
const disposableDomains = [
  'mailinator.com', 'tempmail.com', 'guerrillamail.com',
  '10minutemail.com', 'fakeinbox.com', 'throwawaymail.com',
  'trashmail.com', 'maildrop.cc', 'dispostable.com',
  'yopmail.com', 'getnada.com', 'temp-mail.org'
];


// FIX: Define types for our state objects
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
  const timerRef = useRef<NodeJS.Timeout | null>(null); // For timeout cleanup

  const [email, setEmail] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysisState | null>(null);


  // Check email authenticity
  const checkEmail = useCallback((email) => {
    setIsLoading(true);

    // Clear any existing timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const emailParts = email.split('@');
      const domain = emailParts.length > 1 ? emailParts[1] : '';

      // Basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);

      // Check for disposable domains
      const isDisposable = domain && disposableDomains.includes(domain.toLowerCase());

      // Check for suspicious patterns
      const hasRandomChars = /[0-9]{6,}@/.test(email) || /[a-z]{10,}@/.test(email);
      const isSuspicious = hasRandomChars || email.includes('+fake') || email.includes('.fake');

      // Calculate trust score
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

      // Ensure score doesn't go below 0
      score = Math.max(0, score);

      // Determine status
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

  // Check email when it changes
  useEffect(() => {
    if (email.includes('@') && email.length > 5) {
      checkEmail(email);
    } else {
      setAnalysis(null);
      setIsLoading(false);
    }

    // Cleanup timeout on unmount or email change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [email, checkEmail]);

  // Email content analysis
  const analyzeEmailContent = async () => {
    if (!emailContent.trim()) return;

    setIsLoading(true);
    setContentAnalysis(null);

    try {
      const response = await fetch('/api/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Email #1:\n${emailContent}`
        }),
      });

      const result = await response.json();

      if (result.data) {
        setContentAnalysis({
          raw: result.data
        });
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
    locale === 'th' ? 'ตรวจสอบชื่อโดเมนหลังเครื่องหมาย @' : 'Check the domain name after the @ symbol',
    locale === 'th' ? 'ระวังอีเมลที่มีตัวเลขหรือตัวอักษรสุ่มจำนวนมาก' : 'Beware of emails with lots of random numbers/letters',
    locale === 'th' ? 'ใช้บริการตรวจสอบอีเมลออนไลน์ก่อนตอบกลับ' : 'Use online verification services before replying',
    locale === 'th' ? 'อย่าคลิกลิงก์หรือเปิดไฟล์แนบจากอีเมลที่ไม่รู้จัก' : "Don't click links or open attachments from unknown emails",
    locale === 'th' ? 'ตรวจสอบที่อยู่อีเมลผู้ส่งอย่างละเอียด' : 'Carefully examine the sender email address',
    locale === 'th' ? 'ใช้ที่อยู่อีเมลเฉพาะสำหรับการสมัครบริการออนไลน์' : 'Use dedicated email addresses for online registrations',
    locale === 'th' ? 'เปิดใช้การยืนยันตัวตนสองขั้นตอนสำหรับบัญชีอีเมล' : 'Enable two-factor authentication for email accounts',
    locale === 'th' ? 'เรียนรู้เกี่ยวกับเทคนิคการฟิชชิ่ง' : 'Educate yourself about phishing techniques'
  ];

  return (
    <>
      <Head>
        <title>{t.appName} - {locale === 'th' ? 'ตรวจสอบอีเมลปลอม' : 'Fake Email Detector'}</title>
        <meta name="description" content={locale === 'th' ? 'ตรวจสอบความน่าเชื่อถือของที่อยู่อีเมล' : 'Check the authenticity of email addresses'} />
      </Head>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                  {locale === 'th' ? 'เครื่องมือตรวจสอบอีเมลปลอม' : 'Fake Email Detector'}
                </h1>
                <p className="text-gray-600 text-lg">
                  {locale === 'th'
                    ? 'ตรวจสอบว่าอีเมลนั้นเป็นของแท้หรือถูกสร้างขึ้นมาเพื่อหลอกลวง'
                    : 'Verify whether an email is genuine or created for deceptive purposes'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {locale === 'th' ? 'ป้อนที่อยู่อีเมล:' : 'Enter email address:'}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder={locale === 'th' ? 'example@domain.com' : 'example@domain.com'}
                    />
                    <button
                      onClick={() => checkEmail(email)}
                      disabled={!email.includes('@') || email.length < 5}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${!email.includes('@') || email.length < 5
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
                    <div className="flex justify-between mb-2">
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
                        // FIX: Changed ARIA attributes to numbers
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                          {locale === 'th' ? 'ผลการวิเคราะห์' : 'Analysis Results'}
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            {analysis.isValidFormat ? (
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
                                ? `รูปแบบอีเมล: ${analysis.isValidFormat ? 'ถูกต้อง' : 'ไม่ถูกต้อง'}`
                                : `Email format: ${analysis.isValidFormat ? 'Valid' : 'Invalid'}`}
                            </span>
                          </li>
                          <li className="flex items-start">
                            {!analysis.isDisposable ? (
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
                                ? `โดเมน: ${analysis.domain}`
                                : `Domain: ${analysis.domain}`}
                              <br />
                              <span className="text-sm text-gray-600">
                                {analysis.isDisposable
                                  ? (locale === 'th' ? '(โดเมนชั่วคราว)' : '(Disposable domain)')
                                  : (locale === 'th' ? '(โดเมนถาวร)' : '(Permanent domain)')}
                              </span>
                            </span>
                          </li>
                          <li className="flex items-start">
                            {!analysis.isSuspicious ? (
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
                                ? `รูปแบบ: ${analysis.isSuspicious ? 'น่าสงสัย' : 'ปกติ'}`
                                : `Pattern: ${analysis.isSuspicious ? 'Suspicious' : 'Normal'}`}
                            </span>
                          </li>
                          {analysis.reasons.length > 0 && (
                            <li className="mt-4 p-3 bg-red-50 rounded-lg">
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
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-indigo-800">
                            {locale === 'th' ? 'ตัวอย่างอีเมลปลอม' : 'Fake Email Examples'}
                          </h3>
                          <button
                            onClick={() => setShowTips(!showTips)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <span className="mr-1">
                              {showTips
                                ? (locale === 'th' ? 'ซ่อนเคล็ดลับ' : 'Hide Tips')
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
                        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                          <p className="text-sm mb-2">
                            {locale === 'th'
                              ? 'อีเมลปลอมมักมีรูปแบบเหล่านี้:'
                              : 'Fake emails often have these patterns:'}
                          </p>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>john12345@tempmail.com</li>
                            <li>support@paypa1-security.com</li>
                            <li>amazon-customer@service-fake.net</li>
                            <li>info@faceboook-support.xyz</li>
                          </ul>
                        </div>
                        {showTips && (
                          <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="font-medium text-indigo-800 mb-2">
                              {locale === 'th' ? 'วิธีตรวจสอบอีเมลปลอม' : 'How to Spot Fake Emails'}
                            </h4>
                            <ul className="space-y-2">
                              {emailTips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                  <div className="flex-shrink-0 w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mt-0.5 mr-2">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-indigo-800 mb-4">
                        {locale === 'th' ? 'การป้องกันการหลอกลวงทางอีเมล' : 'Email Fraud Prevention'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                              🛡️
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-800 mb-1">
                                {locale === 'th' ? 'การรับรู้อีเมลฟิชชิ่ง' : 'Phishing Awareness'}
                              </h4>
                              <p className="text-sm">
                                {locale === 'th'
                                  ? 'เรียนรู้วิธีการระบุอีเมลฟิชชิ่งที่พยายามขโมยข้อมูลของคุณ'
                                  : 'Learn how to identify phishing emails attempting to steal your information'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                              🔍
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">
                                {locale === 'th' ? 'การยืนยันโดเมน' : 'Domain Verification'}
                              </h4>
                              <p className="text-sm">
                                {locale === 'th'
                                  ? 'ตรวจสอบโดเมนอย่างระมัดระวังเพื่อให้แน่ใจว่าอีเมลมาจากแหล่งที่ถูกต้อง'
                                  : 'Carefully verify domains to ensure emails come from legitimate sources'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!analysis && !isLoading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {locale === 'th'
                        ? 'ป้อนที่อยู่อีเมลเพื่อเริ่มการตรวจสอบ'
                        : 'Enter an email address to begin verification'}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold text-indigo-800 mb-4">
                  {locale === 'th' ? 'วางจดหมายอีเมลเพื่อตรวจสอบ' : 'Paste Email Letter to Analyze'}
                </h2>
                <textarea
                  rows={8}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
                  placeholder={locale === 'th' ? 'วางเนื้อหาอีเมลที่นี่...' : 'Paste the email content here...'}
                ></textarea>
                <button
                  onClick={analyzeEmailContent}
                  disabled={emailContent.length < 20}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {locale === 'th' ? 'วิเคราะห์จดหมาย' : 'Analyze Letter'}
                </button>
                {contentAnalysis && (
                  <div className="mt-6">
                    <div className="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-lg whitespace-pre-wrap text-sm text-gray-800">
                      <h4 className="font-semibold text-indigo-700 mb-2">
                        {locale === 'th' ? 'ผลการวิเคราะห์ด้วย AI:' : 'AI Analysis Result:'}
                      </h4>
                      <p>{contentAnalysis.raw}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {locale === 'th' ? 'กลับไปยังหน้าหลัก' : 'Back to Homepage'}
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