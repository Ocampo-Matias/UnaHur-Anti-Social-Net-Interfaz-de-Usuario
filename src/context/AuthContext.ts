import { createContext, useContext } from 'react';
import type { User } from '../types';

export type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (nickName: string) => Promise<void>;
  register: (nickName: string, email: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

