'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";

export default function GovernmentPage() {
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    router.replace('/government/dashboard');
  }, [router]);

  return null;
}
