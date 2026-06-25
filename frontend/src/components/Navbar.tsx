<<<<<<< HEAD
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
=======
/**
 * Navigation Bar Component
 * 
 * Displays navigation menu with user-specific links.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BadgeDisplay from './BadgeDisplay';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'Donor') return '/donor/dashboard';
    if (user.role === 'Receiver') return '/receiver/dashboard';
    if (user.role === 'Admin') return '/admin/dashboard';
    return '/';
  };

  return (
<<<<<<< HEAD
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">Givista</Link>
            {isAuthenticated && (
              <div className="hidden md:flex ml-8 space-x-1">
                {[
                  { to: getDashboardLink(), label: 'Dashboard' },
                  { to: '/recommendations', label: 'Recommendations' },
                  { to: '/messages', label: 'Messages' },
                  { to: '/leaderboard', label: 'Leaderboard' },
                  ...(user?.role === 'Donor' ? [{ to: '/donor/analytics', label: 'Analytics' }] : []),
                ].map(link => (
                  <Link key={link.to} to={link.to} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition" aria-label="Toggle theme">
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  {user?.photo_url ? (
                    <img src={user.photo_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700 dark:text-primary-300">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">{user?.name}</span>
                  {user?.isVerified && <span className="text-green-500 text-xs">✅</span>}
                </Link>
                <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">Sign Up</Link>
=======
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Givista
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex space-x-4">
                <Link
                  to={getDashboardLink()}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/recommendations"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Recommendations
                </Link>
                <Link
                  to="/messages"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Messages
                </Link>
                <Link
                  to="/verification"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Verify Profile
                </Link>
                <Link
                  to="/leaderboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Leaderboard
                </Link>
                <Link
                  to="/privacy-settings"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Privacy Settings
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  {user?.badges && user.badges.length > 0 && (
                    <BadgeDisplay badges={user.badges} showTooltip={true} size="sm" />
                  )}
                  {user?.points !== undefined && user.points > 0 && (
                    <span className="text-sm font-semibold text-primary-600">
                      {user.points} pts
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-700 flex items-center">
                  {user?.name}
                  {user?.isVerified && (
                    <span className="ml-2 text-green-600" title="Verified Profile">
                      ✅
                    </span>
                  )}
                  <span className="ml-2 text-gray-500">({user?.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 rounded-md hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Sign Up
                </Link>
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
