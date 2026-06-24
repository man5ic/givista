/**
 * Admin API Functions
 * 
 * Functions for interacting with admin endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';

export interface AdminStatistics {
  users: {
    total: number;
    verified: number;
    unverified: number;
    byRole: Array<{ role: string; count: number }>;
  };
  donations: {
    total: number;
    completed: number;
    pending: number;
    flagged: number;
    thisMonth: number;
    byStatus: Array<{ status: string; count: number }>;
    byCategory: Array<{ category: string; count: number }>;
  };
  requests: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  insights: {
    activeNGOs: number;
    donationsThisMonth: number;
  };
  charts: {
    monthlyGrowth: Array<{ month: string; donations: number; users: number }>;
    donationsByCategory: Array<{ category: string; count: number }>;
  };
}

export const getAdminStatistics = async (): Promise<AdminStatistics> => {
  const response = await api.get<ApiResponse<AdminStatistics>>('/admin/statistics');
  return response.data.data as AdminStatistics;
};

