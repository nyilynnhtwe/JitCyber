"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from './components/Footer';
import TopicCard from './components/TopicCard';
import SecurityTip from './components/SecurityTip';
import LanguageSwitcher from './components/LanguageSwitcher';
import {  Lock, Shield, Smartphone, Users, Key, Zap, ChevronRight, AlertTriangle, Mail, HelpCircle, Star, Menu, X } from 'lucide-react';

// Import localization data
import enData from './data/en.json';
import thData from './data/th.json';
import Link from 'next/link';

export default function Home() {
  const { locale } = useLocale();
  const [activeTopic, setActiveTopic] = useState('phishing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Select the correct localization data
  const t = locale === 'th' ? thData : enData;
  
  // Security tips for each topic
  const securityTips = {
    phishing: [
      'ตรวจสอบ URL เว็บไซต์ก่อนกรอกข้อมูลสำคัญ',
      'อย่าเปิดไฟล์แนบจากอีเมลที่ไม่รู้จัก',
      'ตั้งค่าการยืนยันตัวตนสองขั้นตอน (2FA)'
    ],
    password: [
      'ใช้รหัสผ่านยาวอย่างน้อย 12 อักขระ',
      'ผสมตัวอักษรใหญ่-เล็ก ตัวเลข และสัญลักษณ์',
      'ใช้ตัวจัดการรหัสผ่านเพื่อความปลอดภัย'
    ],
    social: [
      'อย่าเปิดเผยข้อมูลส่วนตัวทางโทรศัพท์',
      'ตรวจสอบตัวตนของผู้ขอข้อมูล',
      'ระวังข้อความเร่งด่วนที่สร้างความตื่นตระหนก'
    ],
    mobile: [
      'อัปเดตระบบปฏิบัติการและแอปเป็นประจำ',
      'ดาวน์โหลดแอปจากแหล่งที่เชื่อถือได้เท่านั้น',
      'เปิดใช้งานการล็อกหน้าจอ'
    ],
    privacy: [
      'ตรวจสอบการตั้งค่าความเป็นส่วนตัวบนโซเชียลมีเดีย',
      'ใช้ VPN เมื่อเชื่อมต่อ Wi-Fi สาธารณะ',
      'ลบข้อมูลที่ไม่จำเป็นออกจากอุปกรณ์'
    ],
    scams: [
      'ระวังข้อความโอนเงินผิดบัญชี',
      'อย่าหลงเชื่อข้อเสนอดีเกินจริง',
      'ตรวจสอบกับหน่วยงานที่เกี่ยวข้องก่อนโอนเงิน'
    ]
  };
  
  // Topic icons mapping
  const topicIcons = {
    phishing: <Mail className="w-5 h-5 text-rose-500" />,
    password: <Key className="w-5 h-5 text-amber-500" />,
    social: <Users className="w-5 h-5 text-emerald-500" />,
    mobile: <Smartphone className="w-5 h-5 text-blue-500" />,
    privacy: <Shield className="w-5 h-5 text-blue-600" />,
    scams: <AlertTriangle className="w-5 h-5 text-blue-700" />
  };
  
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
              <img src="/logo.svg" alt="Logo" className="w-10 h-10 mr-3" />
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
                  <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition-all flex items-center justify-center gap-2">
                    {t.hero.cta1}
                    <Zap className="w-4 h-4" />
                  </button>
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

        {/* Topics Grid */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">{t.topics.title}</h2>
              <p className="text-slate-600">
                {locale === 'th' 
                  ? 'เรียนรู้หัวข้อสำคัญด้านความปลอดภัยไซเบอร์ด้วยวิธีที่เข้าใจง่าย' 
                  : 'Learn essential cybersecurity topics in an easy-to-understand way'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(t.topics)
                .filter(
                  (entry): entry is [string, { title: string; desc: string }] => {
                    const [_key, value] = entry;
                    return typeof value === 'object' && value !== null;
                  }
                )
                .map(([key, topic]) => (
                  <TopicCard
                    key={key}
                    id={key}
                    title={topic.title}
                    description={topic.desc}
                    icon={topicIcons[key]}
                    isActive={activeTopic === key}
                    onClick={() => setActiveTopic(key)}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Learning Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/5">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">
                  {t.learning.title} <span className="text-blue-600">{t.topics[activeTopic].title}</span>
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  {t.topics[activeTopic].desc && (
                    <p className="mb-4 text-slate-600">{t.topics[activeTopic].desc}</p>
                  )}
                  <div className="space-y-3">
                    {securityTips[activeTopic].map((tip, index) => (
                      <SecurityTip
                        key={index}
                        number={index + 1}
                        text={tip}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-3/5">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {t.learning.tips}
                      </h3>
                      <p className="text-slate-500">
                        {locale === 'th' 
                          ? 'นำไปใช้ได้ในชีวิตประจำวัน' 
                          : 'Practical tips for daily life'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {securityTips[activeTopic].map((tip, index) => (
                      <div key={index} className="flex items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-medium mt-1 mr-3">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">
                      {t.learning.quiz}
                    </h3>
                    <p className="mb-4 text-slate-600">
                      {locale === 'th' 
                        ? 'ทดสอบความรู้ของคุณเกี่ยวกับหัวข้อนี้:' 
                        : 'Test your knowledge on this topic:'}
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto hover:shadow-md transition-all">
                      {t.learning.quiz}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
                {t.testimonials.title}
              </h2>
              <p className="text-slate-600">
                {locale === 'th'
                  ? 'ความคิดเห็นจากสมาชิกในชุมชนของเรา'
                  : 'Feedback from our community members'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.testimonials.items.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mr-4 flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{testimonial.author}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 italic">"{testimonial.text}"</p>
                </div>
              ))}
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
                <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all text-lg flex items-center justify-center gap-2">
                  <Link href="/signup" className="flex items-center gap-2">
                    {t.cta.button1}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </button>
                <button className="bg-transparent border-2 border-white/50 px-8 py-3 rounded-lg font-medium hover:border-white hover:bg-white/10 transition-all text-lg flex items-center justify-center gap-2">
                  {t.cta.button2}
                  <HelpCircle className="w-5 h-5" />
                </button>
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