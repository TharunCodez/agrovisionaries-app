'use client';

import { useUser } from '@/firebase';
import type { User } from '@/lib/auth';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type Role = 'farmer' | 'government' | null;

interface RoleContextType {
  user: User | null; // This will hold the custom user object from lib/auth
  role: Role;
  setRole: (role: Role) => void;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user: firebaseUser, isUserLoading } = useUser();
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect synchronizes the firebase auth state with the role context
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }

    if (!firebaseUser) {
      // User is logged out
      setUserState(null);
      setRoleState(null);
      try {
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      } catch (error) {
        console.error("Failed to access localStorage", error);
      }
      setIsLoading(false);
      return;
    }

    // User is logged in, check for role in localStorage first for quick UI restore
    const storedRole = localStorage.getItem('userRole') as Role;
    const storedUser = localStorage.getItem('user');

    if (storedRole && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Verify that the stored user matches the firebase user
      if (parsedUser.uid === firebaseUser.uid) {
        setUserState(parsedUser);
        setRoleState(storedRole);
        setIsLoading(false);
        return;
      }
    }

    // If localStorage is out of sync or empty, determine role from firebaseUser
    // This part is tricky because firebaseUser doesn't have our custom 'role' field.
    // The role is set during the login flow (verifyOTP, signInWithEmailAndPassword).
    // The logic here is mostly for restoring state on page refresh.
    // We can't reliably determine the role from just firebaseUser alone without an extra DB read.
    // For now, we rely on the login flow to set the correct role and user object.
    // If we land here, it means we have a firebase user but no local state.
    // This can happen on a hard refresh. We will be in a loading state until login flow completes.
    // A better approach would be to use custom claims on the Firebase user token.
    
    // For now, we clear state if it's inconsistent.
    setUserState(null);
    setRoleState(null);
    setIsLoading(false); // Let the login flow take over.


  }, [firebaseUser, isUserLoading]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      if (newRole) {
        localStorage.setItem('userRole', newRole);
      } else {
        localStorage.removeItem('userRole');
      }
    } catch (error) {
      console.error('Failed to access localStorage', error);
    }
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    try {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to access localStorage', error);
    }
  };

  return (
    <RoleContext.Provider value={{ user, role, setUser, setRole, isLoading }}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">Loading Application...</p>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      ) : (
        children
      )}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
