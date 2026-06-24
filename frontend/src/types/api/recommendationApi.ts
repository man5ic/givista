/**
 * Recommendation API Functions
 * 
 * Functions for interacting with recommendation endpoints.
 */

import api from './apiService';
import { IRecommendation, ApiResponse } from './types';

export const getRecommendations = async (): Promise<IRecommendation[]> => {
  const response = await api.get<ApiResponse<IRecommendation[]>>('/recommendations');
  return response.data.data as IRecommendation[];
};

