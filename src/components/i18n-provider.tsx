'use client';

import React, { ReactNode, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// This component is necessary because i18next initialization is asynchronous
function I18nInnerProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nInnerProvider>{children}</I18nInnerProvider>
    </Suspense>
  );
}
