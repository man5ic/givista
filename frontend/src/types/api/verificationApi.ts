/**
 * Verification API Functions
 * 
 * Functions for interacting with verification endpoints.
 */

import api from './apiService';
import { ApiResponse } from './types';

export interface VerificationStatus {
  isVerified: boolean;
  verificationType?: 'email' | 'phone' | 'id' | null;
  kycDocument?: string | null;
}

export interface SendOTPResponse {
  verificationId: number;
  expiresAt: string;
}

export const sendOTP = async (data: {
  type: 'email' | 'phone' | 'id';
  phone?: string;
}): Promise<SendOTPResponse> => {
  const response = await api.post<ApiResponse<SendOTPResponse>>('/verification/send-otp', data);
  return response.data.data as SendOTPResponse;
};

export const verifyOTP = async (data: {
  otp: string;
  type: 'email' | 'phone' | 'id';
}): Promise<VerificationStatus> => {
  const response = await api.post<ApiResponse<VerificationStatus>>('/verification/verify-otp', data);
  return response.data.data as VerificationStatus;
};

export const uploadKYC = async (file: File): Promise<{ verificationId: number; documentUrl: string }> => {
  const formData = new FormData();
  formData.append('document', file);
  
  const response = await api.post<ApiResponse<{ verificationId: number; documentUrl: string }>>(
    '/verification/upload-kyc',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data as { verificationId: number; documentUrl: string };
};

export const getVerificationStatus = async (): Promise<VerificationStatus> => {
  const response = await api.get<ApiResponse<VerificationStatus>>('/verification/status');
  return response.data.data as VerificationStatus;
};

export const getVerificationRequests = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>('/verification/requests');
  return response.data.data as any[];
};

export const approveVerification = async (id: number): Promise<void> => {
  await api.post<ApiResponse<void>>(`/verification/approve/${id}`);
};

export const rejectVerification = async (id: number): Promise<void> => {
  await api.post<ApiResponse<void>>(`/verification/reject/${id}`);
};

