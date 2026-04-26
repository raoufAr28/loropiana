import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import { LayoutShell } from '@/components/LayoutShell';
import '../globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  // direction is correctly derived from the locale
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} bg-background text-foreground transition-colors duration-300`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <LayoutShell>
              {children}
            </LayoutShell>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
