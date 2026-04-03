import api from './api';
import type { User, StatsData } from '../types';

interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

interface StatsResponse {
  success: boolean;
  stats: StatsData;
}

/** Get system statistics for the admin dashboard */
export const getStats = async (): Promise<StatsData> => {
  const { data } = await api.get<StatsResponse>('/api/admin/stats');
  return data.stats;
};

/** Get all registered users */
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get<UsersResponse>('/api/admin/users');
  return data.users;
};

/** Delete a user account */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/users/${id}`);
};

/** Delete any ticket (admin override) */
export const deleteTicketAdmin = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/tickets/${id}`);
};
