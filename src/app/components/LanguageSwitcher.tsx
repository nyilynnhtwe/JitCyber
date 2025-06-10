import { useLocale } from "../../context/LocalContext";

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale();
  
  return (
    <div className="flex items-center space-x-1">
      <button 
        onClick={() => changeLocale('th')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'th' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        ไทย
      </button>
      <button 
        onClick={() => changeLocale('en')}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
          locale === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}