/**
 * AI Service Integration
 * 
 * This service communicates with the Python Flask AI microservice
 * to get donation/receiver recommendations.
 */

import axios, { AxiosError } from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

interface AIRecommendationRequest {
  user_id: number;
  user_type: 'donor' | 'receiver';
  category?: string;
  location?: string;
  urgency?: 'Low' | 'Medium' | 'High';
}

interface AIRecommendationResponse {
  recommendations: Array<{
    user_id: number;
    score: number;
    match_details: string;
  }>;
}

/**
 * Get recommendations from AI service
 * 
 * @param request - Recommendation request data
 * @returns AI recommendations
 */
export const getAIRecommendations = async (
  request: AIRecommendationRequest
): Promise<AIRecommendationResponse> => {
  try {
    const response = await axios.post<AIRecommendationResponse>(
      `${AI_SERVICE_URL}/recommend`,
      request,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle timeout
      if (axiosError.code === 'ECONNABORTED') {
        console.error('AI service timeout');
        throw new Error('AI service request timed out');
      }

      // Handle connection errors
      if (axiosError.code === 'ECONNREFUSED') {
        console.error('AI service connection refused');
        throw new Error('AI service is not available');
      }

      // Handle HTTP errors
      if (axiosError.response) {
        console.error('AI service error:', axiosError.response.status, axiosError.response.data);
        throw new Error(`AI service error: ${axiosError.response.status}`);
      }
    }

    console.error('Unexpected error calling AI service:', error);
    throw new Error('Failed to get AI recommendations');
  }
};

/**
 * Retry wrapper for AI service calls
 * 
 * @param fn - Function to retry
 * @param retries - Number of retries (default: 2)
 * @returns Result of function call
 */
export const retryAICall = async <T>(
  fn: () => Promise<T>,
  retries: number = 2
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < retries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        console.log(`Retrying AI call (attempt ${i + 2}/${retries + 1})...`);
      }
    }
  }

  throw lastError || new Error('Failed after retries');
};

