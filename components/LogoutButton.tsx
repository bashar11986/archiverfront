'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('common');

  const handleLogout = function() {
    // امسح أي tokens أو session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // أو إذا كنت تستخدم cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // توجه إلى صفحة تسجيل الدخول
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
    >
      {t('logout')}
    </button>
  );
}
