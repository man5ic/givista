/**
 * Message API Functions
 * 
 * Functions for interacting with message endpoints.
 */

import api from './apiService';
import { IMessage, ApiResponse } from './types';

export const sendMessage = async (data: {
  receiverId: number;
  text: string;
}): Promise<IMessage> => {
  const response = await api.post<ApiResponse<IMessage>>('/messages', data);
  return response.data.data as IMessage;
};

export const getMessages = async (userId?: number): Promise<IMessage[]> => {
  const response = await api.get<ApiResponse<IMessage[]>>('/messages', {
    params: userId ? { userId } : {},
  });
  return response.data.data as IMessage[];
};

