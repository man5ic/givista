/**
 * Request API Functions
 * 
 * Functions for interacting with request endpoints.
 */

import api from './apiService';
import { IRequest, ApiResponse } from './types';

export const createRequest = async (data: {
  title: string;
  description: string;
  category: string;
  urgency?: 'Low' | 'Medium' | 'High';
}): Promise<IRequest> => {
  const response = await api.post<ApiResponse<IRequest>>('/requests', data);
  return response.data.data as IRequest;
};

export const getAllRequests = async (filters?: {
  category?: string;
  status?: string;
  urgency?: string;
  receiverId?: number;
}): Promise<IRequest[]> => {
  const response = await api.get<ApiResponse<IRequest[]>>('/requests', {
    params: filters,
  });
  return response.data.data as IRequest[];
};

export const getRequestById = async (id: number): Promise<IRequest> => {
  const response = await api.get<ApiResponse<IRequest>>(`/requests/${id}`);
  return response.data.data as IRequest;
};

export const updateRequest = async (
  id: number,
  data: Partial<IRequest>
): Promise<IRequest> => {
  const response = await api.put<ApiResponse<IRequest>>(`/requests/${id}`, data);
  return response.data.data as IRequest;
};

