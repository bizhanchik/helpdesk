import { useState, useEffect, useCallback } from 'react';
import type { Ticket } from '../types';
import * as ticketService from '../services/ticketService';
import { toast } from 'react-toastify';

interface Filters {
  status?: string;
  category?: string;
  priority?: string;
}

/**
 * Hook that manages ticket list state — fetching, filtering, and refreshing.
 */
export const useTickets = (initialFilters?: Filters) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters || {});

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getTickets(filters);
      setTickets(data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to load tickets';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading, filters, setFilters, refetch: fetchTickets };
};
