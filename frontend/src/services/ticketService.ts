import api from './api';
import type { Ticket } from '../types';

interface TicketsResponse {
  success: boolean;
  count: number;
  tickets: Ticket[];
}

interface TicketResponse {
  success: boolean;
  ticket: Ticket;
}

/** Fetch tickets — backend filters by role automatically */
export const getTickets = async (params?: {
  status?: string;
  category?: string;
  priority?: string;
}): Promise<Ticket[]> => {
  const { data } = await api.get<TicketsResponse>('/api/tickets', { params });
  return data.tickets;
};

/** Fetch a single ticket by ID */
export const getTicketById = async (id: string): Promise<Ticket> => {
  const { data } = await api.get<TicketResponse>(`/api/tickets/${id}`);
  return data.ticket;
};

/**
 * Create a new ticket with optional file attachment.
 * Sends as multipart/form-data so multer can handle the file.
 */
export const createTicket = async (formData: FormData): Promise<Ticket> => {
  const { data } = await api.post<TicketResponse>('/api/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.ticket;
};

/** Update ticket status (agent/admin only) */
export const updateTicket = async (id: string, status: string): Promise<Ticket> => {
  const { data } = await api.patch<TicketResponse>(`/api/tickets/${id}`, { status });
  return data.ticket;
};

/** Agent claims an unclaimed ticket */
export const claimTicket = async (id: string): Promise<Ticket> => {
  const { data } = await api.patch<TicketResponse>(`/api/tickets/${id}/claim`);
  return data.ticket;
};

/** Delete a ticket (admin only) */
export const deleteTicket = async (id: string): Promise<void> => {
  await api.delete(`/api/tickets/${id}`);
};
