import {getRequestConfig} from 'next-intl/server';

export const locales = ['fr', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale)) {
    locale = 'fr'; // Fallback to 'fr' rather than throwing 404
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
