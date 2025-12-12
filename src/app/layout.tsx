'use client';

import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from '@/components/ui/toaster';
import { RoleProvider } from '@/contexts/role-context';
import { ThemeProvider } from '@/contexts/theme-provider';
import { DataProvider } from '@/contexts/data-context';
import { FirebaseClientProvider } from '@/firebase';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA requirements */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f3d2e" />

        {/* iOS PWA support */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-body antialiased">
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <FirebaseClientProvider>
              <RoleProvider>
                <DataProvider>{children}</DataProvider>
              </RoleProvider>
            </FirebaseClientProvider>
            <Toaster />
          </I18nextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
