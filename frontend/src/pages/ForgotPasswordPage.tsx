import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../types/api/apiService';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateReset = () => {
    const e: Record<string, string> = {};
    if (!otp) e.otp = 'Reset code is required';
    if (!newPassword) e.newPassword = 'New password is required';
    else if (newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      toast.success('Reset code sent! Check your email (or server console in dev mode).');
      if (res.data.devOtp) toast.info(`Dev mode OTP: ${res.data.devOtp}`, { autoClose: 30000 });
      setStep('reset');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset code');
    } finally { setLoading(false); }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateReset()) return;
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! You can now login.');
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err: any) {
      toast.error(err?.message || err?.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {step === 'email' ? "Enter your email to receive a reset code." : `Enter the code sent to ${email} and your new password.`}
          </p>

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="your@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium transition">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">← Back to Login</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reset Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 tracking-widest text-center text-xl ${errors.otp ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="000000" />
                {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.newPassword ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Min 6 characters" />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirm ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Repeat password" />
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium transition">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <p className="text-center text-sm">
                <button type="button" onClick={() => setStep('email')} className="text-primary-600 dark:text-primary-400 hover:underline text-sm">← Send new code</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
