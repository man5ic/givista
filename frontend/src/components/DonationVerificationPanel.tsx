/**
 * Donation Verification Panel Component
 * 
 * Allows admins and verified NGOs to review and approve/reject donations.
 */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getPendingVerifications,
  approveDonation,
  rejectDonation,
} from '../types/api/donationVerificationApi';
import { IDonation } from '../types/api/types';

const DonationVerificationPanel = () => {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getPendingVerifications();
      setDonations(data);
    } catch (error: any) {
      toast.error('Failed to load pending donations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await approveDonation(id);
      toast.success('Donation approved successfully');
      await fetchDonations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve donation');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!remarks.trim()) {
      toast.error('Please provide remarks for rejection');
      return;
    }
    setRejectingId(id);
    try {
      await rejectDonation(id, remarks);
      toast.success('Donation rejected');
      setShowRejectModal(false);
      setRemarks('');
      await fetchDonations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject donation');
    } finally {
      setRejectingId(null);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectingId(id);
    setShowRejectModal(true);
    setRemarks('');
  };

  if (loading) {
    return <div className="text-center py-4">Loading pending donations...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Donation Verification Requests ({donations.length})</h2>
      
      {donations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending donation verifications.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{donation.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      donation.verificationStatus === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : ''
                    }`}>
                      {donation.verificationStatus || 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{donation.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <strong>Donor:</strong> {donation.donor?.name || 'Unknown'} 
                      {donation.donor?.isVerified && (
                        <span className="ml-1 text-green-600" title="Verified Profile">✅</span>
                      )}
                    </p>
                    <p>
                      <strong>Category:</strong> {donation.category} | 
                      <strong> Quantity:</strong> {donation.quantity}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(donation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(donation.id)}
                    disabled={approvingId === donation.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
                  >
                    {approvingId === donation.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => openRejectModal(donation.id)}
                    disabled={rejectingId === donation.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Donation</h3>
            <p className="text-gray-600 mb-4">
              Please provide remarks explaining why this donation is being rejected.
            </p>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter rejection remarks..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
              rows={4}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleReject(rejectingId!)}
                disabled={!remarks.trim() || rejectingId === null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {rejectingId !== null ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRemarks('');
                  setRejectingId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationVerificationPanel;

