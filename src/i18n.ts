import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['fr', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
      locale = 'fr';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
