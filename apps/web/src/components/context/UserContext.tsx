'use client';
import Cookies from 'js-cookie';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface UserContextProps {
  shiftId: number;
  setShiftId: (id: number) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserContextProviderProps {
  children: React.ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [shiftId, setShiftId] = useState<number>(0);
  const token = Cookies.get('token');

  const getShiftID = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cashier/get-shiftId', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shift ID');
      }

      const data = await response.json();
      setShiftId(data.shiftId || 0);
    } catch (error) {
      console.error('Error fetching shift ID:', error);
      setShiftId(0);
    }
  };

  useEffect(() => {
    if (token) {
      getShiftID();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ shiftId, setShiftId }}>
      {children}
    </UserContext.Provider>
  );
}
