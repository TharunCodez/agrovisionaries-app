'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ClientMap = dynamic(() => import('@/components/shared/client-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default ClientMap;
