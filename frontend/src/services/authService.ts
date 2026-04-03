import api from './api';
import { User } from '../types';

interface AuthResponse extends User {
  token: string;
}

/** Register a new client account */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
  return data;
};

/** Log in with email and password, returns user + JWT */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
  return data;
};

/** Fetch the authenticated user's own profile */
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/api/auth/me');
  return data;
};
