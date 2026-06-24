/**
 * Landing Page
 * 
 * The home page with overview and call-to-action buttons.
 */

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Givista
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connecting donors and receivers to make a difference.
            Help orphanages and individuals by donating money, food, clothes, or blood.
          </p>
          
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup?role=Donor"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
              >
                Become a Donor
              </Link>
              <Link
                to="/signup?role=Receiver"
                className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              >
                Request Help
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <Link
              to="/recommendations"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              View Recommendations
            </Link>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Donate Money</h3>
            <p className="text-gray-600">
              Support orphanages and individuals with monetary contributions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Donate Food</h3>
            <p className="text-gray-600">
              Share food supplies with those in need.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">👕</div>
            <h3 className="text-xl font-semibold mb-2">Donate Clothes</h3>
            <p className="text-gray-600">
              Give clothing to help keep people warm and comfortable.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Matching
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent recommendation system matches donors with receivers
            based on location, category, and urgency to maximize impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

