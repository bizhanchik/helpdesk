import { createContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Rehydrate session from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem('hd_token');
    const storedUser = localStorage.getItem('hd_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('hd_token');
        localStorage.removeItem('hd_user');
      }
    }
    setIsLoading(false);
  }, []);

  /** Persist auth data to state and localStorage */
  const persistAuth = useCallback((userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('hd_token', jwtToken);
    localStorage.setItem('hd_user', JSON.stringify(userData));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: jwt, ...userData } = await authService.login(email, password);
    persistAuth(userData, jwt);

    // Redirect based on role
    if (userData.role === 'admin') navigate('/admin');
    else if (userData.role === 'agent') navigate('/agent');
    else navigate('/tickets');
  }, [persistAuth, navigate]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token: jwt, ...userData } = await authService.register(name, email, password);
    persistAuth(userData, jwt);
    navigate('/tickets');
  }, [persistAuth, navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hd_token');
    localStorage.removeItem('hd_user');
    navigate('/login');
  }, [navigate]);

  // Memoize context value to prevent unnecessary re-renders in consumers
  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
