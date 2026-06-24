/**
 * Donor Analytics API Functions
 * 
 * Functions for interacting with donor analytics endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';

export interface DonorAnalytics {
  summary: {
    totalDonations: number;
    totalAmount: number;
    completedDonations: number;
    donationsThisMonth: number;
    peopleHelped: number;
    peopleHelpedThisMonth: number;
  };
  topCategories: Array<{
    category: string;
    count: number;
    totalQuantity: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    totalQuantity: number;
  }>;
}

export const getDonorAnalytics = async (): Promise<DonorAnalytics> => {
  const response = await api.get<ApiResponse<DonorAnalytics>>('/donors/analytics');
  return response.data.data as DonorAnalytics;
};
