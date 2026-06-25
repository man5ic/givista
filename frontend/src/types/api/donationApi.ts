/**
 * Donation API Functions
 * 
 * Functions for interacting with donation endpoints.
 */

import api from './apiService';
import { IDonation, ApiResponse } from './types';

export const createDonation = async (data: {
  title: string;
  category: string;
  quantity: number;
  description: string;
  photo_url?: string;
}): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>('/donations', data);
  return response.data.data as IDonation;
};

export const getAllDonations = async (filters?: {
  category?: string;
  status?: string;
  donorId?: number;
}): Promise<IDonation[]> => {
  const response = await api.get<ApiResponse<IDonation[]>>('/donations', {
    params: filters,
  });
  return response.data.data as IDonation[];
};

export const getDonationById = async (id: number): Promise<IDonation> => {
  const response = await api.get<ApiResponse<IDonation>>(`/donations/${id}`);
  return response.data.data as IDonation;
};

export const updateDonation = async (
  id: number,
  data: Partial<IDonation>
): Promise<IDonation> => {
  const response = await api.put<ApiResponse<IDonation>>(`/donations/${id}`, data);
  return response.data.data as IDonation;
};

export const getFlaggedDonations = async (): Promise<IDonation[]> => {
  const response = await api.get<ApiResponse<IDonation[]>>('/donations/fraud/flagged');
  return response.data.data as IDonation[];
};

export const markDonationSafe = async (id: number): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>(`/donations/fraud/mark-safe/${id}`);
  return response.data.data as IDonation;
};

export const confirmDonationFraud = async (id: number): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>(`/donations/fraud/confirm/${id}`);
  return response.data.data as IDonation;
};

