
import '../globals.css'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/navigation' 
import {LocaleSwitcher} from '@/shared/ui/LocaleSwitcher/index'
import {LogoutButton} from '@/shared/ui/LogoutButton/index'
// import { Toaster } from "react-hot-toast";

// <Toaster position="top-center" reverseOrder={false} />


const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {   
 // const { children, params } = props
  const locale = params.locale

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const t = await getTranslations('common')

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <header className="fixed top-0 left-0 w-full bg-white border shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">{t('myApp')}</h1>
              <LogoutButton />
              </div>
              <div>
                <LocaleSwitcher />
              </div>
            </div>
          </header>
          <main className="pt-24">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
