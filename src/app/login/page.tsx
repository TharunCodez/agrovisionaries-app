'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/contexts/role-context';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { setRole } = useRole();
  const router = useRouter();

  const handleRoleSelection = (role: 'farmer' | 'government') => {
    setRole(role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Agro Visionaries</CardTitle>
          <CardDescription>Select your portal to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full font-bold"
              onClick={() => handleRoleSelection('farmer')}
            >
              Farmer Portal
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full font-bold"
              onClick={() => handleRoleSelection('government')}
            >
              Government Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
