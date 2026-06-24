/**
 * Verification Page
 * 
 * Allows users to verify their profile via email, phone, or ID upload.
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import {
  sendOTP,
  verifyOTP,
  uploadKYC,
  getVerificationStatus,
} from '../types/api/verificationApi';

const VerificationPage = () => {
  const { user, refreshUser } = useAuth();
  const [verificationType, setVerificationType] = useState<'email' | 'phone' | 'id'>('email');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getVerificationStatus();
      setStatus(data);
      if (data.isVerified) {
        setOtpSent(false);
      }
    } catch (error: any) {
      console.error('Failed to fetch verification status:', error);
    }
  };

  const handleSendOTP = async () => {
    if (verificationType === 'phone' && !phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await sendOTP({
        type: verificationType,
        phone: verificationType === 'phone' ? phone : undefined,
      });
      setOtpSent(true);
      toast.success(`OTP sent to your ${verificationType}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP({
        otp,
        type: verificationType,
      });
      toast.success('Verification successful! ✅');
      setOtpSent(false);
      setOtp('');
      await fetchStatus();
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and PDF are allowed.');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadKYC = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      await uploadKYC(selectedFile);
      toast.success('KYC document uploaded. Waiting for admin approval.');
      setSelectedFile(null);
      await fetchStatus();
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Profile</h1>
            <p className="text-gray-600">
              Get verified to build trust with other users on Givista.
            </p>
          </div>

          {status?.isVerified ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                Profile Verified!
              </h2>
              <p className="text-green-700">
                Verification Type: <strong>{status.verificationType?.toUpperCase()}</strong>
              </p>
            </div>
          ) : (
            <>
              {/* Verification Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Method
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setVerificationType('email');
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      verificationType === 'email'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">📧</div>
                    <div className="font-semibold">Email</div>
                  </button>
                  <button
                    onClick={() => {
                      setVerificationType('phone');
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      verificationType === 'phone'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-semibold">Phone</div>
                  </button>
                  <button
                    onClick={() => {
                      setVerificationType('id');
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      verificationType === 'id'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">🆔</div>
                    <div className="font-semibold">ID Upload</div>
                  </button>
                </div>
              </div>

              {/* Email/Phone OTP Verification */}
              {(verificationType === 'email' || verificationType === 'phone') && (
                <div className="space-y-4">
                  {verificationType === 'phone' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={otpSent}
                      />
                    </div>
                  )}

                  {!otpSent ? (
                    <button
                      onClick={handleSendOTP}
                      disabled={loading || (verificationType === 'phone' && !phone)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : `Send OTP to ${verificationType}`}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          OTP sent! Check your {verificationType === 'email' ? 'email' : 'phone'}.
                          <br />
                          <strong>Note:</strong> In development, check the backend console for the OTP code.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enter 6-digit OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center text-2xl tracking-widest"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleVerifyOTP}
                          disabled={loading || otp.length !== 6}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ID Upload */}
              {verificationType === 'id' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Upload a government-issued ID (driver's license, passport, etc.)
                      <br />
                      Formats: JPEG, PNG, PDF (max 5MB)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Document
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleUploadKYC}
                    disabled={loading || !selectedFile}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload & Submit for Review'}
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    Your document will be reviewed by an admin. You'll be notified once approved.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;

