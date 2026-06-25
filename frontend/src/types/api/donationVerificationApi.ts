/**
 * Donation Verification API Functions
 * 
 * Functions for interacting with donation verification endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';
import { IDonation } from './types';

export const getPendingVerifications = async (): Promise<IDonation[]> => {
  const response = await api.get<ApiResponse<IDonation[]>>('/donations/verification/pending');
  return response.data.data as IDonation[];
};

export const approveDonation = async (
  donationId: number,
  remarks?: string
): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>(
    `/donations/verification/approve/${donationId}`,
    { remarks }
  );
  return response.data.data as IDonation;
};

export const rejectDonation = async (
  donationId: number,
  remarks: string
): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>(
    `/donations/verification/reject/${donationId}`,
    { remarks }
  );
  return response.data.data as IDonation;
};

