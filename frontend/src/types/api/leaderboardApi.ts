/**
 * Leaderboard API Functions
 * 
 * Functions for interacting with leaderboard endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';

export interface LeaderboardEntry {
  id: number;
  name: string;
  email: string;
  photo_url?: string;
  isVerified: boolean;
  badges: string[];
  points: number;
  completedDonations: number;
}

export const getLeaderboard = async (sortBy: 'points' | 'donations' = 'points', limit: number = 50): Promise<LeaderboardEntry[]> => {
  console.log('[Leaderboard API] Calling /leaderboard with params:', { sortBy, limit });
  try {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', {
      params: { sortBy, limit },
    });
    console.log('[Leaderboard API] Response received:', response);
    console.log('[Leaderboard API] Response data:', response.data);
    return response.data.data as LeaderboardEntry[];
  } catch (error: any) {
    console.error('[Leaderboard API] Error in getLeaderboard:', error);
    console.error('[Leaderboard API] Error response:', error.response);
    throw error;
  }
};

