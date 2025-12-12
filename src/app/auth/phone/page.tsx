'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { checkFarmerExists } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function PhoneLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved");
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            toast({
                variant: 'destructive',
                title: 'reCAPTCHA Expired',
                description: 'Please try sending the OTP again.',
            });
        }
      });
    }
  }, []);


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
      
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, cleanedNumber, appVerifier);
      
      // Store confirmation result to be used in OTP page
      window.confirmationResult = confirmationResult;

      setOtpSent(true);
      toast({
        title: 'OTP Sent!',
        description: `An OTP has been sent to ${cleanedNumber}.`,
      });
      router.push(`/auth/verify-otp?phone=${encodeURIComponent(cleanedNumber)}&farmerId=${farmerId}`);

    } catch (err) {
      const e = err as Error;
      console.error("Phone sign-in error:", e);
      setError(e.message || 'Failed to send OTP. Please try again.');
       if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          // @ts-ignore
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div id="recaptcha-container"></div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4">
                <img src="/AgroVisionaries_Green.png" alt="Agro Visionaries Logo" className="h-20 w-20 rounded-full object-cover border-2 border-primary shadow-md" />
            </div>
          <CardTitle>Farmer Login</CardTitle>
          <CardDescription>Enter your phone number to receive a verification code.</CardDescription>
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
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
