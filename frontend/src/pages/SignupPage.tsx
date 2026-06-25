<<<<<<< HEAD
=======
/**
 * Signup Page
 * 
 * User registration form with role selection.
 */

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
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
<<<<<<< HEAD
  const [errors, setErrors] = useState<Record<string, string>>({});
=======
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
<<<<<<< HEAD
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
=======
    // Check for role in URL params
    const roleParam = searchParams.get('role');
    if (roleParam && ['Donor', 'Receiver', 'Admin'].includes(roleParam)) {
      setRole(roleParam as UserRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({ name, email, password, role, location });
      toast.success('Account created successfully!');
      
      // Redirect based on role
      if (role === 'Donor') {
        navigate('/donor/dashboard');
      } else if (role === 'Receiver') {
        navigate('/receiver/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="Donor">Donor</option>
                  <option value="Receiver">Receiver</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="City, State or Address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

            <div className="text-sm text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </div>
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
