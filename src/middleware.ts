import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'hi', 'sk'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // You can add more sophisticated locale detection logic here
  // For now, we'll just check the path prefix
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return pathname.split('/')[1];

  // If no locale, you could check headers, cookies, etc.
  // For simplicity, we default to 'en'
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|locales|favicon.ico).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};