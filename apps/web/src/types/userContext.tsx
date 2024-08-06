// import { createContext, useContext, ReactNode } from 'react';

// interface User {
//   cashierId: number;
//   role: 'admin' | 'cashier';
// }
// interface UserContextType {
//   user: User | null;
// }

// const UserContext = createContext<UserContextType>({ user: null });

// export const UserProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
//   return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
// };

// export const useUser = () => useContext(UserContext);
