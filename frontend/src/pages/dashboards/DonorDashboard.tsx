/**
 * Donor Dashboard
 * 
 * Dashboard for donors to manage donations and view recommendations.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllDonations } from '../../types/api/donationApi';
import { IDonation } from '../../types/api/types';
import DonationProgress from '../../components/DonationProgress';
import BadgeDisplay from '../../components/BadgeDisplay';
import ViewBadgesModal from '../../components/ViewBadgesModal';

const DonorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  useEffect(() => {
    fetchDonations();
    // Refresh user data to get updated points and badges
    refreshUser();
  }, []);

  const fetchDonations = async () => {
    try {
      if (user) {
        const data = await getAllDonations({ donorId: user.id });
        setDonations(data);
      }
    } catch (error: any) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Welcome, {user?.name}!
                {user?.isVerified && (
                  <span className="ml-3 text-green-600 text-2xl" title="Verified Profile">
                    ✅
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">Manage your donations and help those in need.</p>
              {user?.badges && user.badges.length > 0 && (
                <div className="mt-3">
                  <BadgeDisplay badges={user.badges} showTooltip={true} size="md" />
                </div>
              )}
              {user?.points !== undefined && (
                <div className="mt-2">
                  <span className="text-lg font-semibold text-primary-600">
                    {user.points} Points
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/privacy-settings"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Privacy Settings
              </Link>
              <button
                onClick={() => setShowBadgesModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                View Badges
              </button>
            </div>
          </div>
          {!user?.isVerified && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-semibold">Verify your profile</p>
                <p className="text-yellow-700 text-sm">Get verified to build trust with other users</p>
              </div>
              <Link
                to="/verification"
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
              >
                Verify Now
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/donor/create-donation"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="text-xl font-semibold mb-2">Create Donation</h3>
            <p className="text-gray-600">Post a new donation offer</p>
          </Link>

          <Link
            to="/donor/analytics"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">View your donation statistics</p>
          </Link>

          <Link
            to="/recommendations"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-600">See matched receivers</p>
          </Link>

          <Link
            to="/messages"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-xl font-semibold mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with receivers</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Donations</h2>
          {donations.length === 0 ? (
            <p className="text-gray-500">You haven't created any donations yet.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {donation.title}
                        {donation.isVerified && (
                          <span className="ml-2 text-green-600" title="Verified Donation">✅</span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{donation.description}</p>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                        <span>Category: {donation.category}</span>
                        <span>Quantity: {donation.quantity}</span>
                        <span className={`px-2 py-1 rounded ${
                          donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                        {donation.verificationStatus && (
                          <span className={`px-2 py-1 rounded ${
                            donation.verificationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                            donation.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            Verification: {donation.verificationStatus}
                          </span>
                        )}
                      </div>
                      {donation.verificationRemarks && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Remarks:</strong> {donation.verificationRemarks}
                        </p>
                      )}
                      {/* Progress bar for tracking donation lifecycle */}
                      <DonationProgress status={donation.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badges Modal */}
      <ViewBadgesModal
        isOpen={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
        userBadges={user?.badges || []}
      />
    </div>
  );
};

export default DonorDashboard;

