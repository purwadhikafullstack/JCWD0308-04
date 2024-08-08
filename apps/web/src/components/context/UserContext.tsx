'use client';
import Cookies from 'js-cookie';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const UserContext = createContext<any>({});
interface UserContextProviderProps {
  children: React.ReactNode;
}

export function UserContextProvider({ children } : UserContextProviderProps) {
  const [user, setUser] = useState<number>(0);
  const token = Cookies.get('token');

  const getApi = async () => {
    const response = await fetch(`http://localhost:8000/api/cashier/getShiftId`,{
      method: 'POST',
      headers: {
        'Authorization' : `Bearer ${token}`
      },
    })
    const data = await response.json()
    setUser(data)
  }
  useEffect(() => {
    if(token) {
      
      getApi()
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
