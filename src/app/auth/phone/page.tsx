'use client';

import { useState }from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Loader2 } from 'lucide-react';
import { sendOTP } from '@/lib/auth';

export default function PhoneLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation for Indian/Nepalese numbers
    const cleanedNumber = phoneNumber.replace(/\s/g, '');
    if (!/^\+?(91|977)\d{9,10}$/.test(cleanedNumber)) {
        setError('Please enter a valid Indian (+91) or Nepalese (+977) number.');
        return;
    }

    setLoading(true);
    try {
      // In a real app, reCAPTCHA would be verified here.
      // The verificationId would be stored to be used on the next page.
      await sendOTP(cleanedNumber);
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(cleanedNumber)}`);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
          <CardTitle>Farmer Login</CardTitle>
          <CardDescription>Enter your phone number to receive a verification code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp} className="space-y-4">
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
              />
            </div>
            {/* Placeholder for reCAPTCHA */}
            <div id="recaptcha-container" className="min-h-[80px]">
                <p className="text-xs text-muted-foreground text-center">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
