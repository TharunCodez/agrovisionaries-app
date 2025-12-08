'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'farmer' | 'government' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('userRole') as Role;
      if (storedRole) {
        setRoleState(storedRole);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: Role) => {
    setIsLoading(true);
    setRoleState(newRole);
    try {
      if (newRole) {
        localStorage.setItem('userRole', newRole);
      } else {
        localStorage.removeItem('userRole');
      }
    } catch (error) {
        console.error("Failed to access localStorage", error);
    }
    setIsLoading(false);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
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
