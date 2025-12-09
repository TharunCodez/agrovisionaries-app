'use client';

import type { User } from '@/lib/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'farmer' | 'government' | null;

interface RoleContextType {
  user: User | null;
  role: Role;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('userRole') as Role;
      if (storedRole) {
        setRoleState(storedRole);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      if (newRole) {
        localStorage.setItem('userRole', newRole);
      } else {
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      }
    } catch (error) {
        console.error("Failed to access localStorage", error);
    }
  };
  
  const setUser = (newUser: User | null) => {
      setUserState(newUser);
      try {
          if(newUser) {
              localStorage.setItem('user', JSON.stringify(newUser));
          } else {
              localStorage.removeItem('user');
          }
      } catch (error) {
          console.error("Failed to access localStorage", error);
      }
  }

  return (
    <RoleContext.Provider value={{ user, role, setUser, setRole, isLoading }}>
      {isLoading ? <div className="flex h-screen items-center justify-center">Loading...</div> : children}
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
