import api from './apiService';
import { IUser, UserRole, ApiResponse } from './types';

// Define the input types for clarity
interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location: string;
}

// Define the success response structure for auth
interface AuthSuccessData {
  user: IUser;
  token: string;
}


// 1. Login Function
export const loginUser = async (payload: LoginPayload): Promise<AuthSuccessData> => {
  try {
    const response = await api.post<ApiResponse<AuthSuccessData>>('/auth/login', payload);
    
    // Store token on successful login
    if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
    }

    return response.data.data as AuthSuccessData;

  } catch (error) {
    // The interceptor already logs the error. We re-throw for component handling.
    throw error;
  }
};

// 2. Signup Function
export const signupUser = async (payload: SignupPayload): Promise<IUser> => {
  try {
    const response = await api.post<ApiResponse<IUser>>('/auth/signup', payload);
    return response.data.data as IUser;
  } catch (error) {
    throw error;
  }
};