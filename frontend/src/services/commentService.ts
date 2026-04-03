import api from './api';
import { Comment } from '../types';

interface CommentsResponse {
  success: boolean;
  comments: Comment[];
}

interface CommentResponse {
  success: boolean;
  comment: Comment;
}

/** Fetch all comments for a given ticket */
export const getComments = async (ticketId: string): Promise<Comment[]> => {
  const { data } = await api.get<CommentsResponse>(`/api/tickets/${ticketId}/comments`);
  return data.comments;
};

/** Post a new comment on a ticket */
export const createComment = async (ticketId: string, text: string): Promise<Comment> => {
  const { data } = await api.post<CommentResponse>(`/api/tickets/${ticketId}/comments`, { text });
  return data.comment;
};
