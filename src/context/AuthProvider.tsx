import { useState, type ReactNode } from 'react';
import type { User } from '../types';
import { getUsers, createUser } from '../services/api';
import { AuthContext } from './AuthContext';

const STORAGE_KEY = 'anti_social_active_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (nickName: string) => {
    const allUsers = await getUsers();
    const found = allUsers.find(
      (u) => u.nickName.trim().toLowerCase() === nickName.trim().toLowerCase()
    );

    if (!found) {
      throw new Error('Usuario no encontrado. Verificá el nombre o registrate.');
    }

    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  };

  const register = async (nickName: string, email: string) => {
    const newUser = await createUser({ nickName: nickName.trim(), email: email.trim() });
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

