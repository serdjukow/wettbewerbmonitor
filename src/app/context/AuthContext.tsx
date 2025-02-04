'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

// Определяем интерфейс для контекста
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

// Создаём контекст с начальными значениями
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithEmail, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Userauth must be used inside AuthProvider');
  }
  return context;
}
