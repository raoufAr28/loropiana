import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr'
});

export const config = {
  matcher: ['/', '/(fr|ar)/:path*']
};
