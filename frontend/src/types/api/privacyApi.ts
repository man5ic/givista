/**
 * Privacy Settings API Functions
 * 
 * Functions for interacting with privacy settings endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';

export interface PrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowLeaderboardVisibility: boolean;
}

export const getPrivacySettings = async (): Promise<PrivacySettings> => {
  const response = await api.get<ApiResponse<PrivacySettings>>('/privacy/settings');
  return response.data.data as PrivacySettings;
};

export const updatePrivacySettings = async (settings: Partial<PrivacySettings>): Promise<PrivacySettings> => {
  const response = await api.put<ApiResponse<PrivacySettings>>('/privacy/settings', settings);
  return response.data.data as PrivacySettings;
};

