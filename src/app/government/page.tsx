'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";
import '@/lib/i18n/client';

export default function GovernmentPage() {
  const router = useRouter();
  useTranslation("common");

  useEffect(() => {
    router.replace('/government/dashboard');
  }, [router]);

  return null;
}
