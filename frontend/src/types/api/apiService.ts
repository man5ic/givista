import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from './types';

// 1. Get Base URL from Environment
// We use `import.meta.env` as this is how Vite exposes environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// 2. Create a custom Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout requests after 10 seconds
  withCredentials: true, // Include credentials for CORS requests
});

// 3. Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('authToken'); 
    
    if (token) {
      // Attach the token as a Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 4. Response Interceptor: Centralized Error Handling
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // If the response is successful (2xx status), return the data
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle specific HTTP error codes
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error(`API Error - Status: ${status}`, data.message);

      // Example: Handle 401 Unauthorized globally
      if (status === 401) {
        // Option: Clear token and redirect to login
        localStorage.removeItem('authToken');
        // window.location.href = '/login'; 
      }

      // Rejects with a standardized error structure
      return Promise.reject(data || { success: false, message: 'An unknown error occurred' });
    } else if (error.request) {
      // The request was made but no response was received (e.g., timeout, network down)
      console.error('API Error: No response received. Network or CORS issue.', error.message);
      return Promise.reject({ success: false, message: 'Network Error or Timeout.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error: Request setup failure.', error.message);
      return Promise.reject({ success: false, message: 'Request Setup Failed.' });
    }
  }
);

export default api;