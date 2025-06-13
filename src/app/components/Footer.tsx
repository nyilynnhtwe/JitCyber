import Link from 'next/link';
/* eslint-disable  @typescript-eslint/no-explicit-any */
type FooterProps = {
  t: any;
  locale: string;
};

export default function Footer({ t, locale }: FooterProps) {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
                <img
                src="./greenlogo.svg"
                alt={t.footer.company}
                className="w-13 h-13 rounded-lg object-contain mr-3"
                />
              <div className="text-xl font-bold text-white">{t.footer.company}</div>
            </div>
            <p className="mb-4">
              {t.footer.slogan}
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs">S{i}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.resources}</h3>
            <ul className="space-y-2">
              {t.footer.links.map((item, index) => (
                <li key={index}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2">
              {t.footer.legalLinks.map((item, index) => (
                <li key={index}>
                  <Link href="#" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2">
              <li>{t.footer.email}</li>
              <li>{t.footer.phone}</li>
              <li>
                {locale === 'th' ? 'กรุงเทพมหานคร' : 'Bangkok'}
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contact_form">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {locale === 'th' ? 'ติดต่อทีมงาน' : 'Contact Team'}
              </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}