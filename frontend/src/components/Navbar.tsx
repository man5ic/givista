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

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'Donor') return '/donor/dashboard';
    if (user.role === 'Receiver') return '/receiver/dashboard';
    if (user.role === 'Admin') return '/admin/dashboard';
    return '/';
  };

  return (
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

