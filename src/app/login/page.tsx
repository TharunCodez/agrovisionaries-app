'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/contexts/role-context';
import { Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword, checkFarmerExists } from '@/lib/auth';

export default function LoginPage() {
  const { setRole, setUser } = useRole();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleGovLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSending(true);
    try {
      const user = await signInWithEmailAndPassword(email, password);
      setUser(user);
      setRole('government');
      router.push(`/government/dashboard`);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Failed to login.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSending(true);
    
    const cleanedNumber = phone.replace(/\s/g, '');
    if (!/^\+?(91|977)\d{9,10}$/.test(cleanedNumber)) {
        setError('Please enter a valid Indian (+91) or Nepalese (+977) number with country code.');
        setIsSending(false);
        return;
    }

    try {
      const { exists, farmerId } = await checkFarmerExists(cleanedNumber);
      if (exists) {
        router.push(`/auth/verify-otp?phone=${encodeURIComponent(cleanedNumber)}&farmerId=${farmerId}`);
      } else {
        setError('No farmer is registered with this phone number.');
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Failed to verify phone number. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
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
          <Tabs defaultValue="farmer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="farmer">Farmer Portal</TabsTrigger>
              <TabsTrigger value="government">Government Portal</TabsTrigger>
            </TabsList>
            <TabsContent value="farmer" className="pt-4">
              <form onSubmit={handlePhoneSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full font-bold"
                    disabled={isSending}
                  >
                    {isSending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login with OTP
                  </Button>
                </div>
              </form>
               <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/farmer/register" className="font-medium text-primary underline">
                    Register here
                  </Link>
                </div>
            </TabsContent>
            <TabsContent value="government" className="pt-4">
              <form onSubmit={handleGovLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full font-bold"
                    variant="secondary"
                    disabled={isSending}
                  >
                    {isSending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
