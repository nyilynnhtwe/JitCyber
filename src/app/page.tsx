"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useLocale } from '@/context/LocalContext';
import Footer from './components/Footer';
import TopicCard from './components/TopicCard';
import SecurityTip from './components/SecurityTip';
import LanguageSwitcher from './components/LanguageSwitcher';

// Import localization data
import enData from './data/en.json';
import thData from './data/th.json';

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

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
        {/* Header */}
        <header className="fixed w-full z-50 bg-white shadow-sm py-3">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div className="text-xl font-bold text-indigo-800">{t.appName}</div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {Object.values(t.nav).map((item, index) => (
                <a 
                  key={index} 
                  href={Object.keys(t.nav)[index]} 
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
              <LanguageSwitcher />
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white py-4 shadow-lg">
              <nav className="container mx-auto px-4 flex flex-col space-y-3">
                {Object.values(t.nav).map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 text-gray-700 max-w-2xl">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
                    {t.hero.cta1}
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-80"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400 rounded-full opacity-80"></div>
                    <div className="bg-white rounded-2xl p-6 relative z-10 shadow-xl">
                      <div className="flex justify-between mb-4">
                        <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                        <div className="w-8 h-8 bg-red-200 rounded-full"></div>
                        <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <h3 className="font-bold text-lg">
                          {locale === 'th' ? 'ปลอดภัย 100%' : '100% Secure'}
                        </h3>
                        <p className="text-sm">
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-900">{t.topics.title}</h2>
              <p className="text-gray-600">
                {locale === 'th' 
                  ? 'เรียนรู้หัวข้อสำคัญด้านความปลอดภัยไซเบอร์ด้วยวิธีที่เข้าใจง่าย' 
                  : 'Learn essential cybersecurity topics in an easy-to-understand way'}
              </p>
            </div>
            
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {Object.entries(t.topics)
    // The filter now acts as a type guard, ensuring 'topic' is an object
    .filter(
      (entry): entry is [string, { title: string; desc: string }] => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        icon={key === 'phishing' ? '🪝' : 
              key === 'password' ? '🔑' : 
              key === 'social' ? '👥' : 
              key === 'mobile' ? '📱' : 
              key === 'privacy' ? '🛡️' : '🎭'}
        isActive={activeTopic === key}
        onClick={() => setActiveTopic(key)}
      />
    ))}
</div>
          </div>
        </section>

        {/* Learning Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-indigo-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
                  {t.learning.title} <span className="text-blue-600">{t.topics[activeTopic].title}</span>
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  {t.topics[activeTopic].desc && (
                    <p className="mb-4 text-gray-700">{t.topics[activeTopic].desc}</p>
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
              <div className="md:w-3/5 md:pl-12">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mr-4">
                      💡
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-800">
                        {t.learning.tips}
                      </h3>
                      <p className="text-gray-600">
                        {locale === 'th' 
                          ? 'นำไปใช้ได้ในชีวิตประจำวัน' 
                          : 'Practical tips for daily life'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {securityTips[activeTopic].map((tip, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mt-1 mr-3">
                          {index + 1}
                        </div>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-indigo-800">
                      {t.learning.quiz}
                    </h3>
                    <p className="mb-4">
                      {locale === 'th' 
                        ? 'ทดสอบความรู้ของคุณเกี่ยวกับหัวข้อนี้:' 
                        : 'Test your knowledge on this topic:'}
                    </p>
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                      {t.learning.quiz}
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-900">
                {t.testimonials.title}
              </h2>
              <p className="text-gray-600">
                {locale === 'th' 
                  ? 'ความคิดเห็นจากสมาชิกในชุมชนของเรา' 
                  : 'Feedback from our community members'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.testimonials.items.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold text-indigo-800">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t.cta.title}
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
                {t.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-colors text-lg">
                  {t.cta.button1}
                </button>
                <button className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors text-lg">
                  {t.cta.button2}
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