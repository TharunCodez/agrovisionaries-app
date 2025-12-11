'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useRole } from '@/contexts/role-context';
import { useData } from '@/contexts/data-context';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/firebase';

export function useLogout() {
  const router = useRouter();
  const { setUser, setRole } = useRole();
  const { setFarmers } = useData();
  const { toast } = useToast();

  return async () => {
    try {
      await signOut(auth);
      // Clear local state
      setUser(null);
      setRole(null);
      if (setFarmers) {
        setFarmers(null); // Clear data context
      }
      // Clear localStorage for a full reset
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        localStorage.removeItem('agrovisionaries-locale');
      }
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: (error as Error).message || 'An unexpected error occurred.',
      });
    }
  };
}
