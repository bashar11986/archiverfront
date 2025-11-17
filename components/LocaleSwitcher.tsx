'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    localStorage.setItem("lang", newLocale);
  };

  return (
    <select 
      value={locale} 
      onChange={(e) => handleChange(e.target.value)}
      className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
    >
      {routing.locales.map((lang) => (
        <option key={lang} value={lang}>
          {lang === 'en' ? 'English' : 'العربية'}
        </option>
      ))}
    </select>
  );
}