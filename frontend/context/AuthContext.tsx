'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await api.post('/auth/login', { email, pass });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      setToken(access_token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Falha ao autenticar. Verifica o e-mail e a senha.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);