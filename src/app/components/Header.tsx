import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from '@/context/LocalContext';

export default function Header() {
  const { locale } = useLocale();
  
  return (
    <header className="w-full z-50 bg-white shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div className="text-xl font-bold text-indigo-800">
            {locale === 'th' ? 'จิตไซเบอร์' : 'JitCyber'}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {/* Navigation items would be here */}
          <LanguageSwitcher />
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSwitcher />
          {/* Mobile menu toggle would be here */}
        </div>
      </div>
    </header>
  );
}