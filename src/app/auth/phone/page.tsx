'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { checkFarmerExists } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function PhoneLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanedNumber = phoneNumber.replace(/\s/g, '');
    if (!/^\+?(91|977)\d{9,10}$/.test(cleanedNumber)) {
        setError('Please enter a valid Indian (+91) or Nepalese (+977) number with country code.');
        setLoading(false);
        return;
    }

    try {
      const { exists, farmerId } = await checkFarmerExists(cleanedNumber);
      if (!exists) {
        setError('No farmer is registered with this phone number.');
        setLoading(false);
        return;
      }
      
      // TEMPORARY: Bypass real OTP sending for development
      setOtpSent(true);
      toast({
        title: 'Development Login',
        description: `Proceed to verify with the development OTP.`,
      });
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(cleanedNumber)}&farmerId=${farmerId}`);

    } catch (err) {
      const e = err as Error;
      console.error("Phone check error:", e);
      setError(e.message || 'Failed to check phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4">
                <img src="/AgroVisionaries_Green.png" alt="Agro Visionaries Logo" className="h-20 w-20 rounded-full object-cover border-2 border-primary shadow-md" />
            </div>
          <CardTitle>Farmer Login</CardTitle>
          <CardDescription>Enter your phone number to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                autoComplete="tel"
                disabled={loading || otpSent}
              />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading || otpSent}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
