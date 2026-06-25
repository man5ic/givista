import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/api/types';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Donor');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['Donor', 'Receiver', 'Admin'].includes(r)) setRole(r as UserRole);
  }, [searchParams]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!location.trim()) e.location = 'Location is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ name, email, password, role, location });
      toast.success('Account created successfully!');
      if (role === 'Donor') navigate('/donor/dashboard');
      else if (role === 'Receiver') navigate('/receiver/dashboard');
      else navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const Field = ({ id, label, type = 'text', value, onChange, placeholder, error }: any) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field id="name" label="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Your full name" error={errors.name} />
            <Field id="email" label="Email address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="Donor">Donor – I want to give</option>
                <option value="Receiver">Receiver – I need help</option>
              </select>
            </div>
            <Field id="location" label="Location" value={location} onChange={(e: any) => setLocation(e.target.value)} placeholder="City, State" error={errors.location} />
            <Field id="password" label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Min. 6 characters" error={errors.password} />
            <Field id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} placeholder="Repeat password" error={errors.confirmPassword} />
            <button type="submit" disabled={loading}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 transition">
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
