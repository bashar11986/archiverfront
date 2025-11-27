'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export  function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('common');

  const handleLogout = function() {
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // rout to login page
    router.push('/adminDashboard/login');
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
