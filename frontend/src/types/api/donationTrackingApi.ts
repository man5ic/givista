/**
 * Donation Tracking API Functions
 */

import api from './apiService';
import { ApiResponse } from './types';
import { IDonation, DonationStatus } from './types';

export const updateDonationStatus = async (
  donationId: number,
  status: DonationStatus,
  remarks?: string
): Promise<IDonation> => {
  const response = await api.post<ApiResponse<IDonation>>(`/donations/${donationId}/status`, { status, remarks });
  return response.data.data as IDonation;
};
