// ── Shared TypeScript interfaces used across the entire application ──────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'agent' | 'admin';
  createdAt: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: 'Hardware' | 'Software' | 'Network';
  priority: 'Low' | 'Medium' | 'High';
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  clientId: User;
  agentId: User | null;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  ticketId: string;
  senderId: Pick<User, '_id' | 'name' | 'role'>;
  text: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
}

export interface StatsData {
  totalTickets: number;
  totalUsers: number;
  openTickets: number;
  resolvedTickets: number;
  ticketsByStatus: Record<string, number>;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
}
